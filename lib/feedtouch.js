var route = require('./feedtouch/route');

var FeedTouch = function () {
};
FeedTouch.prototype.getRoutes = function () {
    return route.highway;
};

exports.FeedTouch = FeedTouch;