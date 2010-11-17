var express = require('express'),
    log4js = require('log4js'),
    logger = log4js.getLogger('app'),
    appPort = 9700,
    app = express.createServer(),
    uniqueId = (new Date()).getTime();

log4js.addAppender(log4js.fileAppender('/var/www/logs/feedtouch.log'), 'app');
logger.setLevel('INFO');
    
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

app.get('/', function (req, res) {
    res.render('index.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            feedUrl: req.query.url
        }
    });
});

app.get('/article', function (req, res) {
    res.render('article.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            articleUrl: req.query.url,
            articleTitle: req.query.title
        }
    });
});

logger.info('Starting application on port ' + appPort);
app.listen(appPort);