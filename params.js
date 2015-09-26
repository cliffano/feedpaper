var fs   = require('fs');
var slug = require('slug');

slug.defaults.mode ='rfc3986';

var env  = process.env['FEEDPAPER_ENV'] || 'stg';
var data = JSON.parse(fs.readFileSync('../ryokan/resources/feedpaper/' + env + '/feeds.json'));

exports.params = {
  slug: function(title, cb) {
    cb(slug(title));
  },
  sitemap: {
    'index.html': { title: 'Feedpaper' }
  },
  categories: data
};
