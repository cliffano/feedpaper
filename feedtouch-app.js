var conf = require('./conf/conf').conf,
    express = require('express'),
    log4js = require('log4js'),
    logger = log4js.getLogger('app'),
    app = express.createServer(),
    uniqueId = (new Date()).getTime();

log4js.addAppender(log4js.fileAppender(conf.log), 'app');
logger.setLevel(conf.logLevel);
    
logger.info('Configuring application');
app.configure(function () {
    app.use(express.conditionalGet());
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use('/images', express.staticProvider(__dirname + '/public/images'));
    app.use('/scripts', express.staticProvider(__dirname + '/public/scripts'));
    app.use('/styles', express.staticProvider(__dirname + '/public/styles'));
    app.use(express.gzip());
    app.register('.html', require('ejs'));
});

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
            feedUrl: url
        }
    });    
};

app.get('/', function (req, res) {
    feed(req, res, req.query.url);
});

app.get('/*', function (req, res) {
    feed(req, res, req.params[0]);
});

logger.info('Starting ' + conf.appName + ' on port ' + conf.appPort);
app.listen(conf.appPort);