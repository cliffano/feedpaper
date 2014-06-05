var handlers = require('./handlers');
var Ute      = require('ute');

function FeedPocket() {
  this.ute = new Ute();
}

FeedPocket.prototype.start = function () {
  this.ute.start(handlers);
};

module.exports = FeedPocket;