var fs   = require('fs');
var p    = require('path');
var slug = require('slug');
var url  = require('url');
var util = require('util');

slug.defaults.mode ='rfc3986';

var env = process.env['FEEDPAPER_ENV'];
var feedsCategories = JSON.parse(fs.readFileSync(p.join('..', 'conf', env, 'feeds.json')));
var conf = JSON.parse(fs.readFileSync(p.join('..', 'conf', env, 'feedpaper.json')));

// in lieu of AE86 pre-hook
var apiBase = url.format({
  protocol: conf.api.protocol,
  hostname: conf.api.host,
  pathname: util.format('v%d/%s', conf.api.version, conf.api.path)
});
var globalJs = fs.readFileSync(p.join('static', 'scripts', 'global.js'));
globalJs = globalJs.replace(/var apiBase = '.*';/, util.format('var apiBase = \'%s\';', apiBase));

exports.params = {
  slug: function(title, cb) {
    cb(slug(title));
  },
  sitemap: {
    'index.html': { title: 'Feedpaper' }
  },
  categories: feedsCategories
};