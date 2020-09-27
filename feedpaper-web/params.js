import fs from 'fs';
import p from 'path';
import slug from 'slug';
import url from 'url';
import util from 'util';

slug.defaults.mode ='rfc3986';

const env = process.env['FEEDPAPER_ENV'];
const conf_dir = process.env['FEEDPAPER_CFG'];
const feedsCategories = JSON.parse(fs.readFileSync(p.join(conf_dir, env, 'feeds.json')));
const conf = JSON.parse(fs.readFileSync(p.join(conf_dir, env, 'feedpaper.json')));

// in lieu of AE86 pre-hook
const apiBase = url.format({
  protocol: conf.api.protocol,
  hostname: conf.api.host,
  pathname: util.format('%d/%s', conf.api.version, conf.api.path)
});
let globalJs = fs.readFileSync(p.join('static', 'scripts', 'global.js.tpl'), 'utf-8');
globalJs = globalJs.replace(/var apiBase = 'PLACEHOLDER';/, util.format('var apiBase = \'%s\';', apiBase));
fs.writeFileSync(p.join('static', 'scripts', 'global.js'), globalJs)

function randomColour() {
  // App.js' colour scheme
  const COLOURS = ['teal', 'green', 'yellow', 'orange', 'red', 'dark-blue', 'blue'];
  return COLOURS[Math.round(Math.random() * 1000) % COLOURS.length];
}

const params = {
  slug: function (title, cb) {
    cb(slug(title));
  },
  app_topbar_colour: function (cb) {
    cb(randomColour());
  },
  sitemap: {
    'index.html': { title: 'Feedpaper' }
  },
  categories: feedsCategories
};

export {
  params as params
};