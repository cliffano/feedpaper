var request = require('request'),
    util = require('./util');

function brochureCb(req, res, next, locals) {
    res.render('brochure.html', {
        layout: 'layout_brochure',
        locals: locals
    });
}
function articleCb(req, res, next, locals) {
    locals.url = req.params[0];
    locals.title = req.query.title || '';
    res.render('article.html', {
        layout: true,
        locals: locals
    });
}
function discoverCb(req, res, next, locals) {
    var url = util.sanitise(req.params[0]);
    request({ uri: url }, function (err, _res, data) {
        if (!err && _res.statusCode === 200) {
            var feeds = util.tags(data, 'link', '(atom|rss)\\+xml').concat(util.tags(data, 'a', '>(atom|rss)<')),
                result = [];
            feeds.forEach(function (feed) {
                result.push({
                    'title': util.attribute(feed, 'title'),
                    'url': util.attribute(feed, 'href')
                });
            });
            res.send(JSON.stringify(result), 200);
        } else {
            res.send('', 200);
        }
    });
}
function homeCb(req, res, next, locals) {
    locals.url = util.sanitise(req.params[0]);
    locals.maxItems = 50;
    res.render('home.html', {
        layout: true,
        locals: locals
    });
}
exports.routes = [
    { method: 'get', path: '/', cb: brochureCb },
    { method: 'get', path: '/a/*?', cb: articleCb },
    { method: 'get', path: '/s/*?', cb: discoverCb },
    { method: 'get', path: '/*', cb: homeCb }
];