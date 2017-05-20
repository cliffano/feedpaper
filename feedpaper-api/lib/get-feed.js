var aws      = require('aws-sdk');
var feedRead = require('feed-read');
var fs       = require('fs');
var slug     = require('slug');
var _url     = require('url');
var util     = require('util');

slug.defaults.mode ='rfc3986';

// build feed index for fast lookup
var index = {};
var feedsConf = JSON.parse(fs.readFileSync('feeds.json'));
feedsConf.forEach(function (category) {
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

  var feedpaperConf = JSON.parse(fs.readFileSync('feedpaper.json'));
  var url           = index[event.categoryId][event.feedId];
  var table         = feedpaperConf.database.table;

  var dynamoDb = new aws.DynamoDB();

  function fetchFeedCb(err, articlesList) {
    if (err) {
      context.fail(err);
    } else {
      var params = {
        TableName: table,
        Item: {
          id: { 'S': slug(url) },
          type: { 'S': 'feed' },
          articles: { 'S': JSON.stringify(articlesList) },
          TimeToExist: { 'N': (Math.floor(Date.now() / 1000) + 21600).toString() }
        }
      };
      dynamoDb.putItem(params, function (err, data) {
        if (err) {
          console.error('Unable to save feed: ' + url, err);
          context.fail(err);
        } else {
          context.succeed(params.Item.articles.S);
        }
      });
    }
  }

  var params = {
    TableName: table,
    Key : {
      id : {
        "S" : slug(url)
      }
    }
  };
  dynamoDb.getItem(params, function (err, data) {
    if (err || !data.Item) {
      fetchFeed(url, fetchFeedCb);
    } else {
      console.log('Found feed: ' + url);
      context.succeed(data.Item.articles.S);
    }
  });
}

exports.handler = getFeed;
