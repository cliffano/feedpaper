var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    log4js = require('log4js')(),
    sys = require('sys'),
    logger = log4js.getLogger('app'),
    conf = JSON.parse(fs.readFileSync('./app.conf', 'utf-8')),
    app = express.createServer(),
    uniqueId = (new Date()).getTime();

log4js.addAppender(log4js.fileAppender(conf.log.file), 'app');
logger.setLevel(conf.log.level);
    
logger.info('Configuring application');
app.configure(function () {
    app.register('.html', require('ejs'));
    app.set('views', __dirname + '/views');
    app.use('/images', express.staticProvider(__dirname + '/public/images'));
    app.use('/scripts', express.staticProvider(__dirname + '/public/scripts'));
    app.use('/styles', express.staticProvider(__dirname + '/public/styles'));
    app.use(express.bodyDecoder());
    app.use(express.conditionalGet());
    app.use(express.gzip());
    app.use(express.methodOverride());
});

logger.info('Setting up routers');
app.get('/article', function (req, res) {
    res.render('article.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            articleUrl: req.query.url,
            articleTitle: req.query.title || ''
        }
    });
});
var site = function (url, cb) {
    var client = http.createClient(80, url),
        req = client.request('GET', '/', {'host': url});
    req.end();
    req.on('response', function (res) {
        res.setEncoding('utf8');
        var data = '', done = false;
        res.on('data', function (chunk) {
            if (done === false) {
                data += chunk;
                if (chunk.match(/<\s*body.*>/)) {
                    done = true;
                }
            }
        });
        res.on('end', function () {
            cb(data);
        });
    });
};
app.get('/s/*', function (req, res) {
    var url = req.params[0].replace(/^https?:\/\//, '');
    site(url, function (data) {
        var feeds = data.match(/<\s*link.*(atom|rss)\+xml.*>/g) || [],
            item;
        for (item in feeds) {
            feeds[item] = {
                'title': feeds[item].replace(/.*title="/, '').replace(/".*/, ''),
                'url': feeds[item].replace(/.*href="/, '').replace(/".*/, '')
            }
        }
        res.send(JSON.stringify(feeds), 200);
    });
});
var feed = function (req, res, url) {
    res.render('feed.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            feedUrl: url,
            maxItems: 50
        }
    });    
};
app.get('/', function (req, res) {
    feed(req, res, req.query.url);
});
app.get('/*', function (req, res) {
    var url = (req.params[0].match(/^http:\/\//)) ? req.params[0] : 'http://' + req.params[0];
    feed(req, res, url);
});

process.on('uncaughtException', function (error) {
    logger.error('An unexpected error has occured. ' + sys.inspect(error));
});

logger.info('Starting ' + conf.app.name + ' on port ' + conf.app.port + ' in env ' + process.env.ENV);
app.listen(conf.app.port);