var cli       = require('bagofcli');
var FeedPaper = require('./feedpaper');

function _start(args) {
  
  const FEEDS_FILE = 'conf/feeds.json';
  var opts = {
    feedsFile: args.feedsFile || FEEDS_FILE
  };

  var feedPaper = new FeedPaper(opts);
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