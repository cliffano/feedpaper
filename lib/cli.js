var cli       = require('bagofcli');
var FeedTouch = require('./feedtouch');

function _start() {
  var feedTouch = new FeedTouch();
  feedTouch.start();
}

/**
 * Execute FeedTouch CLI.
 */
function exec(type) {
  var actions = {
    commands: {
      start: { action: _start }
    }
  };

  cli.command(__dirname, actions);
}

exports.exec = exec;