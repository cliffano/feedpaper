var fs = require('fs'),
    log4js = require('log4js')(),
    conf = JSON.parse(fs.readFileSync('./package.json', 'utf-8')),
    logger = log4js.getLogger('feedtouch'),
    Parser = require('./feedtouch/parser').Parser,
    Url = require('./feedtouch/url').Url;

log4js.addAppender(log4js.fileAppender(conf.log.file), 'feedtouch');
logger.setLevel(conf.log.level);

var FeedTouch = function () {
    logger.info('Initialising FeedTouch');
    this.parser = new Parser();
    this.url = new Url();
};
FeedTouch.prototype.sanitise = function (_url) {
    return this.url.sanitise(_url);
};
FeedTouch.prototype.getFeeds = function (text) {
    var feeds = this.parser.getTags(text, 'link', '(atom|rss)\\+xml'),
        item;
    for (item in feeds) {
        if (feeds.hasOwnProperty(item)) {
            feeds[item] = {
                'title': this.parser.getAttribute(feeds[item], 'title'),
                'url': this.parser.getAttribute(feeds[item], 'href')
            };
        }
    }
    return feeds;
};

exports.FeedTouch = FeedTouch;