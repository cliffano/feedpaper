var async          = require('async');
var feedRead       = require('feed-read');
var fs             = require('fs');
var NodeCache      = require('node-cache');
var readabilitySax = require('readabilitySAX');

function Data() {
  this.conf  = JSON.parse(fs.readFileSync('conf/data.json'));
  this.cache = new NodeCache({ stdTTL: 21600, checkperiod: 21600 });

  this.initConf();
  this.initCache();
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

Data.prototype.initCache = function () {
  var self = this;

  var feedTasks = [];
  this.categoryList.forEach(function (category) {
    category.feeds.forEach(function (feed) {

      function feedTask(cb) {
        self.fetchFeed(feed.url, function (err, articlesList) {
          if (err) {
            cb(err);

          } else {
            self.cache.set(feed.url, articlesList, function (err, success) {
              if (err) {
                cb(err);
              } else {

                var articleTasks = [];
                articlesList.forEach(function (article) {
                  function articleTask(cb) {
                    self.fetchArticle(article.url, function (article) {
                      if (article.url === undefined) {
                        cb(new Error('Unable to fetch article', article));
                      } else {
                        self.cache.set(article.url, article, cb);
                      }
                    });
                  }
                  articleTasks.push(articleTask);
                });

                async.parallelLimit(articleTasks, 5, cb);
              }
            });
          }
        });
      }
      feedTasks.push(feedTask);
    });
  });
  async.parallelLimit(feedTasks, 2, function (err) {
    if (err) {
      console.error('An error occurred while initialising feeds cache', err);
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
    if (err) { cb(err); }

    var articlesList = [];
    articles.forEach(function (article) {
      articlesList.push({
        url  : article.link,
        title: article.title
      });
    });

    cb(null, articlesList);
  });
};

Data.prototype.fetchArticle = function (url, cb) {
  console.log('* Fetching article: ' + url);

  readabilitySax.get(url, function (result) {
    cb({
      url    : result.link,
      title  : result.title,
      content: result.html
    });
  });
};

Data.prototype.slug = function (text) {
  return text.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z\-]/g, '');
};

module.exports = Data;