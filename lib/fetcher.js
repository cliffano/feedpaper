var feedRead = require('feed-read');
var read     = require('node-read');
var _url     = require('url');

function fetchFeed(url, cb) {
  console.log('[.] Fetching feed: ' + url);

  feedRead(url, function(err, articles) {
    if (err) {
      console.error('[x] Unable to fetch feed: ' + url, err);
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

function fetchArticle(url, cb) {
  console.log('[.] Fetching article: ' + url);

  read(url, function (err, article, meta) {
    cb({
      url    : url,
      source : _url.parse(url).hostname,
      title  : article.title,
      content: article.content
    });
  });
}

exports.fetchFeed    = fetchFeed;
exports.fetchArticle = fetchArticle;