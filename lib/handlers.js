var Data = require('./data');
var data = new Data();

function feedPocketPage(req, res) {
  res.render('feedpocket.html', {
    layout: 'layout',
    locals: {
      categories: data.categoryList
    }
  });
}

function feedData(req, res) {
  data.getFeed(req.params.feedId, function (err, articles) {
    if (err) {
      res.error(err);
    } else {
      res.json(articles);
    }
  });
}

function articleData(req, res) {
  data.getArticle(req.params[0], function (err, article) {
    res.json(article);
  });
}

exports.feedPocketPage = feedPocketPage;
exports.feedData       = feedData;
exports.articleData    = articleData;