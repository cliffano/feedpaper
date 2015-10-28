var fs   = require('fs');
var p    = require('path');
var slug = require('slug');

slug.defaults.mode ='rfc3986';

var env = process.env['FEEDPAPER_ENV'] || 'stg';
var feedsCategories = JSON.parse(fs.readFileSync(p.join('..', 'conf', env, 'feeds.json')));

exports.params = {
  slug: function(title, cb) {
    cb(slug(title));
  },
  sitemap: {
    'index.html': { title: 'Feedpaper' }
  },
  categories: feedsCategories
};
