var aws      = require('aws-sdk');
var feedRead = require('feed-read');
var fs       = require('fs');
var slug     = require('slug');
var _url     = require('url');
var util     = require('util');

slug.defaults.mode ='rfc3986';

// build feed index for fast lookup
var index = {};
var conf = JSON.parse(fs.readFileSync('feeds.json'));
conf.forEach(function (category) {
  var categoryId = slug(category.title);
  index[categoryId] = {};
  category.feeds.forEach(function (feed) {
    var feedId = slug(feed.title);
    index[categoryId][feedId] = feed.url;
  });
});

function fetchFeed(url, cb) {
  console.log('Fetching feed: ' + url);

  feedRead(url, function(err, articles) {
    if (err) {
      console.error('Unable to fetch feed: ' + url, err);
      cb(err);
    } else {

      var articlesList = [];
      articles.forEach(function (article) {

        // append link to feed host if link doesn't contain protocol
        if (!article.link.match(/^http/)) {
          if (!article.link.match(/^\//)) {
            article.link = '/' + article.link;
          }
          var elems = _url.parse(url);
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
}

function getFeed(event, context) {

  var url      = index[event.categoryId][event.feedId];
  var bucket   = 'feedpaper-data-stg';
  var endpoint = 's3-ap-southeast-2.amazonaws.com';
  var key      = util.format('%s/%s/%s', category, id, slug(url));

  var s3 = new aws.S3({ endpoint: new aws.Endpoint(endpoint) });

  function fetchFeedCb(err, articlesList) {
    if (err) {
      context.fail(err);
    } else {
      var params = {
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(articlesList)
      };
      console.log('Saving feed: ' + url);
      s3.putObject(params, function (err, data) {
        if (err) {
          console.error('Unable to save feed: ' + url, err);
          context.fail(err);
        } else {
          context.succeed(params.Body);
        }
      });
    }
  }

  var params = {
    Bucket: bucket,
    Key: key
  };
  s3.getObject(params, function (err, data) {
    if (err) {
      fetchFeed(url, fetchFeedCb);
    } else {
      console.log('Found feed: ' + url);
      context.succeed(data.Body.toString('utf-8'));
    }
  });
}

exports.handler = getFeed;
