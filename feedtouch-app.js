var assetManager = require('connect-assetmanager'),
    assetHandler = require('connect-assetmanager-handlers'),
    express = require('express'),
    FeedTouch = require('./lib/feedtouch').FeedTouch,
    fs = require('fs'),
    http = require('http'),
    log4js = require('log4js')(),
    request = require('request'),
    sys = require('sys'),
    logger = log4js.getLogger('app'),
    conf = JSON.parse(fs.readFileSync('./app.conf', 'utf-8')),
    app = express.createServer(),
    feedTouch = new FeedTouch(),
    uniqueId = (new Date()).getTime();

log4js.addAppender(log4js.fileAppender(conf.log.file), 'app');
logger.setLevel(conf.log.level);
    
logger.info('Configuring application');
var assetManagerGroups = {
    'js': {
        'route': /\/scripts\/feedtouch\.js/,
        'path': './public/scripts/',
        'dataType': 'javascript',
        'files': ['global.js']
    },
    'css': {
        'route': /\/styles\/feedtouch\.css/,
        'path': './public/styles/',
        'dataType': 'css',
        'files': ['global.css'],
        'preManipulate': {
            'MSIE': [
                assetHandler.yuiCssOptimize
            ],
            '^': [
                assetHandler.yuiCssOptimize
            ]
        }
    }
};
app.configure(function () {
    app.use(assetManager(assetManagerGroups));
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

logger.info('Setting up routes');
app.get('/a', function (req, res) {
    res.render('article.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            url: req.query.url,
            title: req.query.title || ''
        }
    });
});
var site = function (url, cb) {
    request({uri: url}, function (err, res, data) {
        if (!err && res.statusCode === 200) {
            cb(data);
        } else {
            logger.error('Unable to retrieve ' + url +
                ' with response code ' + res.statusCode +
                ' error ' + err);
            cb('');
        }
    });
};
app.get('/s/*', function (req, res) {
    site(feedTouch.sanitise(req.params[0]), function (data) {
        res.send(JSON.stringify(feedTouch.getFeeds(data)), 200);
    });
});
var home = function (req, res, url) {
    res.render('home.html', {
        layout: true,
        locals: {
            env: process.env.ENV,
            uniqueId: uniqueId,
            url: url,
            maxItems: 50
        }
    });    
};
app.get('/', function (req, res) {
    if (req.query.url) {
        home(req, res, req.query.url);
    } else {
        res.render('brochure.html', {
            layout: false,
            locals: {
                env: process.env.ENV,
                uniqueId: uniqueId
            }
        });  
    }
});
app.get('/*', function (req, res) {
    home(req, res, feedTouch.sanitise(req.params[0]));
});

process.on('uncaughtException', function (error) {
    logger.error('An unexpected error has occured. ' + sys.inspect(error));
});

logger.info('Starting ' + conf.app.name + ' on port ' + conf.app.port + ' in env ' + process.env.ENV);
app.listen(conf.app.port);