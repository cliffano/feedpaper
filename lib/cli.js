var cli       = require('bagofcli');
var FeedPaper = require('./feedpaper');

function _start() {
  
  
  var feedPaper = new FeedPaper();
  feedPaper.start();
}

/**
 * Execute FeedPaper CLI.
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