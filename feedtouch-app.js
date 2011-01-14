var express = require('express'),
    fs = require('fs'),
    log4js = require('log4js')(),
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
    feed(req, res, req.params[0]);
});

logger.info('Starting ' + conf.app.name + ' on port ' + conf.app.port + ' in env ' + process.env.ENV);
app.listen(conf.app.port);