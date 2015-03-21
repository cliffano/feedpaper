var footer = 'Studio Cliffano | 2011-' + new Date().getFullYear();

function feedPaperPage(req, res) {
  // null article must be passed here otherwise ejs template won't generate html
  // there's no log message that explains why so it's not obvious to debug
  res.render('feedpaper.html',
    { categories: exports.cache.categoryList, article: null, footer: footer },
    function (err, html) {
      res.send(html);
    }
  );
}

function articlePage(req, res) {
  if (!req.url) {
    res.status(500).send('Invalid article URL: ' + url);
  } else {
    var articleUrl = req.url.match(/http.+$/)[0];
    res.render('feedpaper.html',
      { categories: exports.cache.categoryList, article: { url: articleUrl }, footer: footer },
      function (err, html) {
        res.send(html);
      }
    );
  }
}

function feedData(req, res) {
  exports.cache.getFeed(req.params.feedId, function (err, articles) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(articles);
    }
  });
}

function articleData(req, res) {
  var url = req.url.match(/http.+$/);
  if (Array.isArray(url)) {
    url = url[0];
  } 
  exports.cache.getArticleCheckExist(url, function (err, article) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(article);
    }
  });
}

exports.feedPaperPage = feedPaperPage;
exports.articlePage   = articlePage;
exports.feedData      = feedData;
exports.articleData   = articleData;