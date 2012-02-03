var jscoverageHack = require('../lib/feedtouch'),
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

  return {
    discover: discover
  };
}

exports.FeedTouch = FeedTouch;