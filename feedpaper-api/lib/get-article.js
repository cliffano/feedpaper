var aws  = require('aws-sdk');
var fs   = require('fs');
var read = require('node-read');
var qs   = require('querystring');
var slug = require('slug');
var _url = require('url');
var util = require('util');

slug.defaults.mode ='rfc3986';

function fetchArticle(url, cb) {
  console.log('Fetching article: ' + url);

  read(url, function (err, article, meta) {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        url    : url,
        source : _url.parse(url).hostname,
        title  : article.title,
        content: article.content
      });
    }
  });
}

function getArticle(event, context) {

  var feedpaperConf = JSON.parse(fs.readFileSync('feedpaper.json'));
  var url           = qs.unescape(event.url);
  var table         = feedpaperConf.database.table;

  var dynamoDb = new aws.DynamoDB();

  function fetchArticleCb(err, article) {
    if (err) {
      context.fail(err);
    } else {
      var params = {
        TableName: table,
        Item: {
          id: { 'S': slug(url) },
          type: { 'S': 'article' },
          content: { 'S': JSON.stringify(article) }
        }
      };
      dynamoDb.putItem(params, function (err, data) {
        if (err) {
          console.error('Unable to save article: ' + url, err);
          context.fail(err);
        } else {
          context.succeed(params.Item.content.S);
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
      fetchArticle(url, fetchArticleCb);
    } else {
      console.log('Found article: ' + url);
      context.succeed(data.Item.content.S);
    }
  });
}

exports.handler = getArticle;
