var handlers = require('./handlers');
var Ute      = require('ute');

function FeedPocket() {
  this.ute = new Ute();
}

FeedPocket.prototype.start = function () {
  this.ute.start(handlers);
  handlers.data.buildCache(function (err) {
    if (err) {
      console.error(err);
    }
    handlers.data.refreshCache();
  });
};

module.exports = FeedPocket;