var request = require('request'),
    etc = require('./feedtouch/etc');

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
    var url = etc.sanitiseUrl(req.params[0]);
    request({ uri: url }, function (err, _res, data) {
        if (!err && _res.statusCode === 200) {
            var feeds = etc.getTags(data, 'link', '(atom|rss)\\+xml').concat(etc.getTags(data, 'a', '>(atom|rss)<')),
                result = [];
            feeds.forEach(function (feed) {
                result.push({
                    'title': etc.getAttribute(feed, 'title'),
                    'url': etc.getAttribute(feed, 'href')
                });
            });
            res.send(JSON.stringify(result), 200);
        } else {
            res.send('', 200);
        }
    });
}
function homeCb(req, res, next, locals) {
    locals.url = etc.sanitiseUrl(req.params[0]);
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