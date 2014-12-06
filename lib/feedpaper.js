var Cache    = require('./cache');
var fs       = require('fs');
var handlers = require('./handlers');
var Ute      = require('ute');
var util     = require('./util');

function FeedPaper(opts) {
  this.opts = opts;
  this.ute = new Ute();
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
      var feedId = util.slug(feed.title);
      feeds.push({
        id   : feedId,
        title: feed.title,
        url  : feed.url
      });
      urlLookup[feedId] = feed.url;
    });

    categoryList.push({
      id   : util.slug(category.title),
      title: category.title,
      feeds: feeds
    });
  });

  this.cache = new Cache(categoryList, urlLookup);
};

FeedPaper.prototype.start = function () {
  var self = this;

  handlers.cache = this.cache;
  this.ute.start(handlers);  

  this.cache.build(function (err) {
    if (err) {
      console.error(err);
    }
    self.cache.refresh();
  });
};

module.exports = FeedPaper;