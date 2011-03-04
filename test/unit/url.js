var assert = require('assert'),
    vows = require('vows'),
	Url = require('../../lib/feedtouch/url').Url;

vows.describe('URL').addBatch({
	'url': {
		topic: new Url(),
		'sanitise': {
			'keeps original URL': function (url) {
				assert.equal(url.sanitise('http://feedtouch.cliffano.com/rss'), 'http://feedtouch.cliffano.com/rss');
				assert.equal(url.sanitise('https://google.com/search'), 'https://google.com/search');
			},
			'adds protocol to URL': function (url) {
				assert.equal(url.sanitise('feedtouch.cliffano.com/atom'), 'http://feedtouch.cliffano.com/atom');
			}
		}
	}
}).export(module);