var async    = require('async');
var cron     = require('cron');
var fetcher  = require('./fetcher');
var levelup  = require('level');
var levelttl = require('level-ttl');

const MAX_FETCH        = 5;
const REFRESH_SCHEDULE = '0 0 */1 * * *';

function Cache(categoryList, urlLookup, opts) {
  this.categoryList = categoryList;
  this.urlLookup    = urlLookup;

  this.db = levelttl(levelup(opts.dbDir), {
    defaultTTL: opts.defaultTtl,
    checkFrequency: opts.checkFrequency
  });
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
      cb();
    } else {
      self.db.put(feedUrl, JSON.stringify(articlesList), function (err) {
        cb(err, articlesList);
      });
    }
  });
};

Cache.prototype.setArticle = function (articleUrl, cb) {
  var self = this;
  fetcher.fetchArticle(articleUrl, function (err, article) {
    if (err) {
      // log fetch article error but allow passthrough
      console.error('[x] Unable to save article ' + articleUrl, err);
      cb();
    } else {
      // strip fragment identifier from article URL
      // fragment identifier is only available on the client browser and not on the server
      // some feeds, e.g. BBC's contain links with fragment identifier
      self.db.put(articleUrl.replace(/#.*$/, ''), JSON.stringify(article), cb);
    }
  });
};

Cache.prototype.setArticleCheckExist = function (articleUrl, cb) {
  var self = this;
  this.getArticle(articleUrl, function (err, article) {
    if (err) {
      // an error could mean either the article doesn't yet exist or a genuine error
      // in this case, attempt to set the article anyway
      self.setArticle(articleUrl, cb);
    } else {
      console.log('[i] Article already exists ' + articleUrl);
      // re-add article in order to refresh TTL
      self.db.put(articleUrl, JSON.stringify(article), cb);
    }
  });
};

Cache.prototype.getFeed = function (feedId, cb) {
  var url = this.urlLookup[feedId];
  this.db.get(url, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, JSON.parse(result));
    }
  });
};

Cache.prototype.getArticle = function (articleUrl, cb) {
  this.db.get(articleUrl, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, JSON.parse(result));
    }
  });
};

Cache.prototype.getArticleCheckExist = function (articleUrl, cb) {
  var self = this;
  this.getArticle(articleUrl, function (err, result) {
    // an error could mean either the article doesn't yet exist or a genuine error
    // in this case, attempt to set the article anyway
    if (err) {
      self.setArticle(articleUrl, function (err, result) {
        if (err) {
          cb(err);
        } else {
          self.getArticle(articleUrl, cb);
        }
      });
    } else {
      cb(null, result);
    }
  });
};

module.exports = Cache;