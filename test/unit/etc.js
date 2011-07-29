var assert = require('assert'),
    vows = require('vows'),
    etc = require('../../lib/feedtouch/etc');

vows.describe('etc').addBatch({
    'etc': {
        'sanitiseUrl': {
            'keeps original URL': function () {
                assert.equal(etc.sanitiseUrl('http://feedtouch.cliffano.com/rss'), 'http://feedtouch.cliffano.com/rss');
                assert.equal(etc.sanitiseUrl('https://google.com/search'), 'https://google.com/search');
            },
            'adds protocol to URL': function () {
                assert.equal(etc.sanitiseUrl('feedtouch.cliffano.com/atom'), 'http://feedtouch.cliffano.com/atom');
            }
        },
        'getTags': {
            'return a single link tag when text contains only one tag': function () {
                var tags = etc.getTags('<link type="application/atom+xml" title="My Feed" href="/myfeed"/>', 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 1);
                assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
            },
            'return all link tags when text contains multiple tags': function () {
                var tags = etc.getTags(' <link type="application/atom+xml" title="My Feed" href="/myfeed"/><title>Blah</title><link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>', 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 2);
                assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
                assert.equal(tags[1], '<link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>');
            },
            'return empty array when text does not contain expected tag': function () {
                var tags = etc.getTags('<title>Blah</title>', 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 0);
            },
            'return empty array when text contains expected tag but not expected hint': function () {
                var tags = etc.getTags('<link href="/myfeed"/>', 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 0);
            },
            'return empty array when expected tag is undefined': function () {
                var tags = etc.getTags('<link type="application/atom+xml" href="/myfeed"/>', undefined, '(atom|rss)\\+xml');
                assert.equal(tags.length, 0);
            },
            'return link tag when expected tag is provided but expected hint is undefined': function () {
                var tags = etc.getTags('<link href="/myfeed"/>', 'link', undefined);
                assert.equal(tags.length, 1);
                assert.equal('<link href="/myfeed"/>', tags[0]);
            },
            'return empty array when text is not provided': function () {
                var tags = etc.getTags(undefined, 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 0);
                tags = etc.getTags(null, 'link', '(atom|rss)\\+xml');
                assert.equal(tags.length, 0);
            },
	    'return anchor tag with particular text': function () {
		var tags = etc.getTags('<a href="/myfeed"/>RSS</a><a href="/myfeed"/>Atom</a>', 'a', '>RSS<');
		assert.equal(tags.length, 1);
		assert.equal('<a href="/myfeed"/>RSS</a>', tags[0]);
		assert.equal('<a href="/myfeed"/>Atom</a>', tags[1]);
	    }
        },
        'getAttribute': {
            'return expected attribute value': function () {
                assert.equal(etc.getAttribute('<link title="My Feed" href="/myfeed"/>', 'href'), '/myfeed');
                assert.equal(etc.getAttribute('<link title=\'My Feed\' href=\'/myfeed\'/>', 'title'), 'My Feed');
                assert.equal(etc.getAttribute('<  link   title="My Feed"   href="/myfeed" / >', 'href'), '/myfeed');
                assert.equal(etc.getAttribute('<  link   title="My Feed"   href="/myfeed" / >', 'title'), 'My Feed');
                assert.equal(etc.getAttribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'href'), '/myfeed');
                assert.equal(etc.getAttribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'title'), 'My Feed');
            },
            'return null when the attribute does not exist': function () {
                assert.isNull(etc.getAttribute('<link title="My Feed" href="/myfeed">', 'blah'));
                assert.isNull(etc.getAttribute('', 'blah'));
            },
            'return null when text is not provided': function () {
                assert.isNull(etc.getAttribute(null, 'blah'));
                assert.isNull(etc.getAttribute(undefined, 'blah'));
            },
            'return null when attribute name is not provided': function () {
                assert.isNull(etc.getAttribute('<link title="My Feed" href="/myfeed">', null));
                assert.isNull(etc.getAttribute('<link title="My Feed" href="/myfeed">', undefined));
            }
        }
    }
}).export(module);