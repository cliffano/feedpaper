var handlers = require('./handlers');
var Ute      = require('ute');

function FeedTouch() {
  this.ute = new Ute();
}

FeedTouch.prototype.start = function () {
  this.ute.start(handlers);
};

module.exports = FeedTouch;
/*
var jscoverageHack = require('../lib/feedtouch'),
  readabilitySax = require('readabilitySAX'),
  request = require('request'),
  util = require('./util');

function FeedTouch() {
  
  function discover(url, cb) {
    request({ url: url }, function (err, res, data) {
      if (err) {
        cb(new Error('Feed discovery error: ' + err.message));
      } else {
        if (res.statusCode === 200) {
          var feeds = util.tags(data, 'link', '(atom|rss)\\+xml').
              concat(util.tags(data, 'a', '>(atom|rss)<')),
            result = [];
          feeds.forEach(function (feed) {
            result.push({
              'title': util.attribute(feed, 'title'),
              'url': util.attribute(feed, 'href')
            });
          });
          cb(null, result);
        } else {
          cb(new Error('Feed discovery error: Unexpected status code: ' + res.statusCode));
        }
      }
    });  
  }

  function article(url, cb) {
    readabilitySax.get(url, function (result) {
      cb(null, { title: result.title, url: result.link, content: result.html });
    });
  }

  return {
    discover: discover,
    article: article
  };
}

exports.FeedTouch = FeedTouch;
*/