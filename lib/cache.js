var async     = require('async');
var cron      = require('cron');
var fetcher   = require('./fetcher');
var NodeCache = require('node-cache');

const MAX_FETCH        = 5;
const REFRESH_SCHEDULE = '0 0 */1 * * *';

function Cache(categoryList, urlLookup) {
  this.categoryList = categoryList;
  this.urlLookup    = urlLookup;

  // cache TTL set to two hours, checked every 15 minutes
  // NOTE: cache refresh is set to every hour
  //       which means that feeds cache will already be updated when the original TTL is hit
  //       but the articles that fall out of the feed won't be updated and will eventually expire
  this.cache = new NodeCache({ stdTTL: 7200, checkperiod: 900 });
}

Cache.prototype.build = function (cb) {
  var self = this;
  console.log('[i] Building cache at ' + new Date());

  var feedTasks = [];
  this.categoryList.forEach(function (category) {
    category.feeds.forEach(function (feed) {
      function feedTask(cb) {
        self.setFeed(feed.url, cb);
      }
      feedTasks.push(feedTask);
    });
  });
  async.parallelLimit(feedTasks, MAX_FETCH, function (err, articlesLists) {
    if (err) {
      cb(err);
    } else {

      var articleTasks = [];
      articlesLists.forEach(function (articlesList) {

        if (Array.isArray(articlesList)) {
          articlesList.forEach(function (article) {
            function articleTask(cb) {
              self.setArticle(article.url, cb);
            }
            articleTasks.push(articleTask);
          });
        } else {
          console.error('[x] Unexpected articlesList: ' + articlesList);
        }

      });
      async.parallelLimit(articleTasks, MAX_FETCH, function (err, results) {
        if (!err) {
          console.log('[v] Cache build done');

          var stats = self.cache.getStats();
          console.log('[i] Cache stats:');
          console.log('    Key count - %s', stats.keys);
          console.log('    Hits count - %s', stats.hits);
          console.log('    Misses count - %s', stats.misses);
          console.log('    Key size - %s', stats.ksize);
          console.log('    Value size - %s', stats.vsize);
        }
        cb(err, results);
      });
    }
  });
};

Cache.prototype.refresh = function () {
  var self = this;
  console.log('[i] Scheduling cache refresh with ' + REFRESH_SCHEDULE);

  var CronJob = cron.CronJob;
  var job     = new CronJob(
    REFRESH_SCHEDULE,
    function () {
      console.log('[i] Refreshing cache at ' + new Date());
      self.build(function (err) {
        if (err) {
          console.error(err);
        }
      });
    },
    function () {
      console.log('[v] Cache refresh done');
    },
    true
  );
};

Cache.prototype.setFeed = function (feedUrl, cb) {
  var self = this;
  fetcher.fetchFeed(feedUrl, function (err, articlesList) {
    if (err) {
      console.error(err);
      cb();
    } else {
      self.cache.set(feedUrl, articlesList, function (err) {
        cb(err, articlesList);
      });
    }
  });
};

Cache.prototype.setArticle = function (articleUrl, cb) {
  var self = this;
  fetcher.fetchArticle(articleUrl, function (article) {
    if (article.url === undefined) {
      console.error(new Error('[x] Unable to fetch article ' + articleUrl));
      cb();
    } else {
      // strip fragment identifier from article URL
      // fragment identifier is only available on the client browser and not on the server
      // some feeds, e.g. BBC's contain links with fragment identifier
      self.cache.set(articleUrl.replace(/#.*$/, ''), article, cb);
    }
  });
};

Cache.prototype.getFeed = function (feedId, cb) {
  var url = this.urlLookup[feedId];
  this.cache.get(url, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result[url]);
    }
  });
};

Cache.prototype.getArticle = function (url, cb) {
  this.cache.get(url, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result[url]);
    }
  });
};

module.exports = Cache;