var feedRead       = require('feed-read');
var readabilitySax = require('readabilitySAX');
var _url           = require('url');

function fetchFeed(url, cb) {
  console.log('[.] Fetching feed: ' + url);

  feedRead(url, function(err, articles) {
    if (err) {
      console.error('[x] Unable to fetch feed: ' + url, err);
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

function fetchArticle(url, cb) {
  console.log('[.] Fetching article: ' + url);

  readabilitySax.get(url, function (result) {
    cb({
      url    : url,
      source : _url.parse(url).hostname,
      title  : result.title,
      content: result.html
    });
  });
};

exports.fetchFeed    = fetchFeed;
exports.fetchArticle = fetchArticle;