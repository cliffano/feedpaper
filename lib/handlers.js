function feedPaperPage(req, res) {
  res.render('feedpaper.html',
    { categories: exports.cache.categoryList },
    function (err, html) {
      res.send(html);
    }
  );
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
  exports.cache.getArticle(url, function (err, article) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(article);
    }
  });
}

exports.feedPaperPage = feedPaperPage;
exports.feedData      = feedData;
exports.articleData   = articleData;