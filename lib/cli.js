var cli       = require('bagofcli');
var FeedPaper = require('./feedpaper');

function _start(args) {
  
  var opts = {
    confDir: args.confDir || 'conf',
    feedsFile: args.feedsFile || 'conf/feeds.json'
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