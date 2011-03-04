var assert = require('assert'),
    vows = require('vows'),
	Parser = require('../../lib/feedtouch/parser').Parser;

vows.describe('Parser').addBatch({
	'parser': {
		topic: new Parser(),
		'getTags': {
			'return a single link tag when text contains only one tag': function (parser) {
				var tags = parser.getTags('<link type="application/atom+xml" title="My Feed" href="/myfeed"/>', 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 1);
				assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
			},
			'return all link tags when text contains multiple tags': function (parser) {
				var tags = parser.getTags(' <link type="application/atom+xml" title="My Feed" href="/myfeed"/><title>Blah</title><link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>', 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 2);
				assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
				assert.equal(tags[1], '<link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>');
			},
			'return empty array when text does not contain expected tag': function (parser) {
				var tags = parser.getTags('<title>Blah</title>', 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 0);
			},
			'return empty array when text contains expected tag but not expected hint': function (parser) {
				var tags = parser.getTags('<link href="/myfeed"/>', 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 0);
			},
			'return empty array when expected tag is undefined': function (parser) {
				var tags = parser.getTags('<link type="application/atom+xml" href="/myfeed"/>', undefined, '(atom|rss)\\+xml');
				assert.equal(tags.length, 0);
			},
			'return link tag when expected tag is provided but expected hint is undefined': function (parser) {
				var tags = parser.getTags('<link href="/myfeed"/>', 'link', undefined);
				assert.equal(tags.length, 1);
				assert.equal('<link href="/myfeed"/>', tags[0]);
			},
			'return empty array when text is not provided': function (parser) {
				var tags = parser.getTags(undefined, 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 0);
				tags = parser.getTags(null, 'link', '(atom|rss)\\+xml');
				assert.equal(tags.length, 0);
			}
		},
		'getAttribute': {
			'return expected attribute value': function (parser) {
				assert.equal(parser.getAttribute('<link title="My Feed" href="/myfeed"/>', 'href'), '/myfeed');
				assert.equal(parser.getAttribute('<link title=\'My Feed\' href=\'/myfeed\'/>', 'title'), 'My Feed');
				assert.equal(parser.getAttribute('<  link   title="My Feed"   href="/myfeed" / >', 'href'), '/myfeed');
				assert.equal(parser.getAttribute('<  link   title="My Feed"   href="/myfeed" / >', 'title'), 'My Feed');
				assert.equal(parser.getAttribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'href'), '/myfeed');
				assert.equal(parser.getAttribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'title'), 'My Feed');
			},
			'return null when the attribute does not exist': function (parser) {
				assert.isNull(parser.getAttribute('<link title="My Feed" href="/myfeed">', 'blah'));
				assert.isNull(parser.getAttribute('', 'blah'));
			},
			'return null when text is not provided': function (parser) {
				assert.isNull(parser.getAttribute(null, 'blah'));
				assert.isNull(parser.getAttribute(undefined, 'blah'));
			},
			'return null when attribute name is not provided': function (parser) {
				assert.isNull(parser.getAttribute('<link title="My Feed" href="/myfeed">', null));
				assert.isNull(parser.getAttribute('<link title="My Feed" href="/myfeed">', undefined));
			}
		}
	}
}).export(module);