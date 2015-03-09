var cli       = require('bagofcli');
var FeedPaper = require('./feedpaper');

function _start(args) {
  
  var opts = {
    confDir: args.confDir || 'conf',
    feedsFile: args.feedsFile || 'conf/feeds.json',
    cache: {
      dbDir: args.cacheDbDir || '/tmp/feedpaper.db',
      defaultTtl: args.cacheTtl || 1000 * 60 * 60 * 2,
      checkFrequency: args.cacheCheckFrequency || 1000 * 60 * 60 * 0.25
    }
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