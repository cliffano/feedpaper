var feedTouch = new (require('./feedtouch')).FeedTouch(),
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
  feedTouch.discover(url, function (err, result) {
    if (err) {
      res.send(JSON.stringify({ err: err.message }), 404);
    } else {
      res.send(JSON.stringify(result), 200);
    }
  });
}

// render article page with url arg
function article(req, res, next, locals) {
  feedTouch.readable(req.params[0], function (err, result) {
    if (err) {
      res.send(JSON.stringify({ err: err.message }), 404);
    } else {
      locals.url = result.url;
      locals.title = result.title || 'Untitled';
      locals.content = result.content;
      res.render('article.html', {
        layout: true,
        locals: locals
      });
    }
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