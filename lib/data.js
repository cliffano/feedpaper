var async          = require('async');
var cron           = require('cron');
var feedRead       = require('feed-read');
var fs             = require('fs');
var NodeCache      = require('node-cache');
var readabilitySax = require('readabilitySAX');
var _url           = require('url');

var MAX_FETCH = 5;

function Data() {
  this.conf  = JSON.parse(fs.readFileSync('conf/data.json'));

  // cache TTL set to 2 hours, checked every hour
  // NOTE: cache refresh is set to every hour
  //       which means that feeds cache will already be updated when the original TTL is hit
  //       but the articles that fall out of the feed won't be updated and will eventually expire
  this.cache = new NodeCache({ stdTTL: 7200, checkperiod: 3600 });

  this.initConf();
}

Data.prototype.initConf = function () {
  var self = this;
  
  var categoryList = [];
  var urlLookup    = {};

  this.conf.forEach(function (category) {

    var feeds = [];
    category.feeds.forEach(function (feed) {
      var feedId = self.slug(feed.title);
      feeds.push({
        id   : feedId,
        title: feed.title,
        url  : feed.url
      });
      urlLookup[feedId] = feed.url;
    });

    categoryList.push({
      id   : self.slug(category.title),
      title: category.title,
      feeds: feeds
    });
  });

  this.categoryList = categoryList;
  this.urlLookup    = urlLookup;
};

Data.prototype.initCache = function (cb) {
  var self = this;

  var feedTasks = [];
  this.categoryList.forEach(function (category) {
    category.feeds.forEach(function (feed) {
      function feedTask(cb) {
        self.cacheFeed(feed.url, cb);
      }
      feedTasks.push(feedTask);
    });
  });
  async.parallelLimit(feedTasks, MAX_FETCH, function (err, articlesLists) {
    if (err) {
      console.error('! Unable to initialise feeds cache', err);
    } else {

      var articleTasks = [];
      articlesLists.forEach(function (articlesList) {

        if (Array.isArray(articlesList)) {
          articlesList.forEach(function (article) {
            function articleTask(cb) {
              self.cacheArticle(article.url, cb);
            }
            articleTasks.push(articleTask);
          });
        } else {
          console.error('! Unexpected articlesList: ' + articlesList)
          cb();
        }

      });
      async.parallelLimit(articleTasks, MAX_FETCH, cb);
    }
  });
};

Data.prototype.refreshCache = function () {
  var self = this;
  console.log('# Scheduling cache refresh');

  var CronJob = cron.CronJob;
  var job     = new CronJob({
    cronTime: '0 0 */1 * * *',
    onTick: function () {
      console.log('# Refreshing cache');
      self.initCache();
    },
    start: false
  });
  job.start();
};

Data.prototype.cacheFeed = function (feedUrl, cb) {
  var self = this;
  this.fetchFeed(feedUrl, function (err, articlesList) {
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

Data.prototype.cacheArticle = function (articleUrl, cb) {
  var self = this;
  this.fetchArticle(articleUrl, function (article) {
    if (article.url === undefined) {
      console.error(new Error('! Unable to fetch article ' + articleUrl));
      cb();
    } else {
      // strip fragment identifier from article URL
      // fragment identifier is only available on the client browser and not on the server
      // some feeds, e.g. BBC's contain links with fragment identifier
      self.cache.set(articleUrl.replace(/#.*$/, ''), article, cb);
    }
  });
};

Data.prototype.getFeed = function (feedId, cb) {
  var url = this.urlLookup[feedId];
  this.cache.get(url, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result[url]);
    }
  });
};

Data.prototype.getArticle = function (url, cb) {
  this.cache.get(url, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result[url]);
    }
  });
};

Data.prototype.fetchFeed = function (url, cb) {
  console.log('* Fetching feed: ' + url);

  feedRead(url, function(err, articles) {
    if (err) {
      console.error('! Unable to fetch feed: ' + url, err);
      cb();
    } else {

      var articlesList = [];
      articles.forEach(function (article) {

        // append link to feed host if link doesn't contain protocol
        if (!article.link.match(/^http/)) {
          if (!article.link.match(/^\//)) {
            article.link = '/' + article.link;
          }
          elems = _url.parse(url);
          article.link = url.replace(new RegExp(elems.path), '') + article.link;
        }

        articlesList.push({
          url  : article.link,
          title: article.title
        });
      });

      cb(null, articlesList);
    }
  });
};

Data.prototype.fetchArticle = function (url, cb) {
  console.log('* Fetching article: ' + url);

  readabilitySax.get(url, function (result) {
    cb({
      url    : url,
      title  : result.title,
      content: result.html
    });
  });
};

Data.prototype.slug = function (text) {
  return text.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z\-]/g, '');
};

module.exports = Data;