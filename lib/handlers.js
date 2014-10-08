function feedPocketPage(req, res) {
  res.render('feedpocket.html', {
    layout: 'layout',
    locals: {
      categories: exports.cache.categoryList
    }
  });
}

function feedData(req, res) {
  exports.cache.getFeed(req.params.feedId, function (err, articles) {
    if (err) {
      res.error(err);
    } else {
      res.json(articles);
    }
  });
}

function articleData(req, res) {
  var url = req.url.match(/http.+$/);
  exports.cache.getArticle(url, function (err, article) {
    res.json(article);
  });
}

exports.feedPocketPage = feedPocketPage;
exports.feedData       = feedData;
exports.articleData    = articleData;