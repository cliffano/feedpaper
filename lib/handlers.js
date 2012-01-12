var request = require('request'),
    util = require('./util');

// render home page with url arg
function home(req, res, next, locals) {
  locals.url = util.sanitise(req.params[0]);
  res.render('home.html', {
    layout: true,
    locals: locals
  });
}

// discover feed links by scraping the page
function discover(req, res, next, locals) {
  var url = util.sanitise(req.params[0]);
  request({ url: url }, function (err, _res, data) {
    if (err) {
      res.send(JSON.stringify({ err: 'Feed discovery error: ' + err.message }), 404);
    } else {
      if (_res.statusCode === 200) {
        var feeds = util.tags(data, 'link', '(atom|rss)\\+xml').
            concat(util.tags(data, 'a', '>(atom|rss)<')),
          result = [];
        feeds.forEach(function (feed) {
          result.push({
            'title': util.attribute(feed, 'title'),
            'url': util.attribute(feed, 'href')
          });
        });
        res.send(JSON.stringify(result), 200);
      } else {
        res.send(JSON.stringify({ err: 'Feed discovery error: Unexpected status code: ' + _res.statusCode}), 404);
      }
    }
  });
}

// render article page with url arg
function article(req, res, next, locals) {
  locals.url = req.params[0];
  locals.title = req.query.title || 'Untitled';
  res.render('article.html', {
    layout: true,
    locals: locals
  });
}

// render brochure page, using brochure layout
function brochure(req, res, next, locals) {
  res.render('brochure.html', {
    layout: 'layout_brochure',
    locals: locals
  });
}

exports.home = home;
exports.discover = discover;
exports.article = article;
exports.brochure = brochure;