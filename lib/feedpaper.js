var Cache    = require('./cache');
var fs       = require('fs');
var handlers = require('./handlers');
var slug     = require('slug');
var Ute      = require('ute');

function FeedPaper(opts) {
  this.opts = opts;
  this.ute = new Ute({ envConfDir: opts.confDir });
  this.init();
}

FeedPaper.prototype.init = function () {
  var categoryList = [];
  var urlLookup    = {};

  console.log('[i] Loading data');

  var conf = JSON.parse(fs.readFileSync(this.opts.feedsFile));
  conf.forEach(function (category) {

    var feeds = [];
    category.feeds.forEach(function (feed) {
      var feedId = slug(feed.title);
      feeds.push({
        id   : feedId,
        title: feed.title,
        url  : feed.url
      });
      urlLookup[feedId] = feed.url;
    });

    categoryList.push({
      id   : slug(category.title),
      title: category.title,
      feeds: feeds
    });
  });

  this.cache = new Cache(categoryList, urlLookup, this.opts.cache);
};

FeedPaper.prototype.start = function () {

  handlers.cache = this.cache;
  this.ute.start(handlers);

  this.cache.refresh();
  this.cache.build(function (err) {
    if (err) {
      console.error('[x] Unable to build cache', err);
    } else {
      console.log('[v] Cache build done');
    }
  });
};

module.exports = FeedPaper;
