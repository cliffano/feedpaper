var aws  = require('aws-sdk');
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

  var category = "dummy";
  var feed     = "dummy";
  var url      = qs.unescape(event.url);

  var bucket   = 'feedpaper-data-stg';
  var endpoint = 's3-ap-southeast-2.amazonaws.com';
  var key      = util.format('%s/%s/articles/%s', category, feed, slug(url));

  var s3 = new aws.S3({ endpoint: new aws.Endpoint(endpoint) });

  function fetchArticleCb(err, article) {
    if (err) {
      context.fail(err);
    } else {
      var params = {
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(article)
      };
      console.log('Saving article: ' + url);
      s3.putObject(params, function (err, data) {
        if (err) {
          console.error('Unable to save article: ' + url, err);
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
      fetchArticle(url, fetchArticleCb);
    } else {
      console.log('Found article: ' + url);
      context.succeed(data.Body.toString('utf-8'));
    }
  });
}

exports.handler = getArticle;
