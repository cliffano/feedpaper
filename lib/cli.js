var cli       = require('bagofcli');
var FeedPaper = require('./feedpaper');
var log4js    = require('log4js');
var p         = require('path');

function _start() {
  log4js.configure(p.join(__dirname, '../conf/log4js.json'));
  
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