var fs   = require('fs');
var p    = require('path');
var slug = require('slug');
var url  = require('url');
var util = require('util');

slug.defaults.mode ='rfc3986';

var env = process.env['FEEDPAPER_ENV'];
var conf_dir = process.env['FEEDPAPER_CFG'];
var feedsCategories = JSON.parse(fs.readFileSync(p.join(conf_dir, env, 'feeds.json')));
var conf = JSON.parse(fs.readFileSync(p.join(conf_dir, env, 'feedpaper.json')));

// in lieu of AE86 pre-hook
var apiBase = url.format({
  protocol: conf.api.protocol,
  hostname: conf.api.host,
  pathname: util.format('%d/%s', conf.api.version, conf.api.path)
});
var globalJs = fs.readFileSync(p.join('static', 'scripts', 'global.js.tpl'), 'utf-8');
globalJs = globalJs.replace(/var apiBase = 'PLACEHOLDER';/, util.format('var apiBase = \'%s\';', apiBase));
fs.writeFileSync(p.join('static', 'scripts', 'global.js'), globalJs)

function randomColour() {
  // App.js' colour scheme
  COLOURS = ['teal', 'green', 'yellow', 'orange', 'red', 'dark-blue', 'blue'];
  return COLOURS[Math.round(Math.random() * 1000) % COLOURS.length];
}

exports.params = {
  slug: function(title, cb) {
    cb(slug(title));
  },
  app_topbar_colour: function(cb) {
    cb(randomColour());
  },
  sitemap: {
    'index.html': { title: 'Feedpaper' }
  },
  categories: feedsCategories
};
