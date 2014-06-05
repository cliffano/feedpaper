var handlers = require('./handlers');
var Ute      = require('ute');

function FeedPocket() {
  this.ute = new Ute();
}

FeedPocket.prototype.start = function () {
  var self = this;
  handlers.data.initCache(function () {
    self.ute.start(handlers);
  });
};

module.exports = FeedPocket;