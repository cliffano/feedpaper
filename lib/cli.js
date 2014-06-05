var cli        = require('bagofcli');
var FeedPocket = require('./feedpocket');

function _start() {
  var feedPocket = new FeedPocket();
  feedPocket.start();
}

/**
 * Execute FeedPocket CLI.
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