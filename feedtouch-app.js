var FeedTouch = require('./lib/feedtouch').FeedTouch,
    Ute = require('ute').Ute,
    feedTouch = new FeedTouch(),
    ute = new Ute({
        err404: false
    });

ute.start(feedTouch.getRoutes());