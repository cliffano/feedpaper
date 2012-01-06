var assert = require('assert'),
  vows = require('vows');

vows.describe('util').addBatch({
  'util': {
    topic: function () {
      return require('../lib/util');
    },
    'sanitise': {
      'should keep original URL when it already contains protocol': function (topic) {
        assert.equal(topic.sanitise('http://feedtouch.cliffano.com/rss'), 'http://feedtouch.cliffano.com/rss');
        assert.equal(topic.sanitise('https://google.com/search'), 'https://google.com/search');
      },
      'should add protocol to URL when it does not contain protocol': function (topic) {
        assert.equal(topic.sanitise('feedtouch.cliffano.com/atom'), 'http://feedtouch.cliffano.com/atom');
      }
    },
    'tags': {
      'should return a single link tag when text contains only one tag': function (topic) {
        var tags = topic.tags('<link type="application/atom+xml" title="My Feed" href="/myfeed"/>', 'link', '(atom|rss)\\+xml');
        assert.equal(tags.length, 1);
        assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
      },
      'should return all link tags when text contains multiple tags': function (topic) {
        var tags = topic.tags(' <link type="application/atom+xml" title="My Feed" href="/myfeed"/><title>Blah</title><link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>', 'link', '(atom|rss)\\+xml');
        assert.equal(tags.length, 2);
        assert.equal(tags[0], '<link type="application/atom+xml" title="My Feed" href="/myfeed"/>');
        assert.equal(tags[1], '<link type="application/atom+xml" title="Your Feed" href="/yourfeed"/>');
      },
      'should return empty array when text does not contain expected tag': function (topic) {
        assert.isEmpty(topic.tags('<title>Blah</title>', 'link', '(atom|rss)\\+xml'));
      },
      'should return empty array when text contains expected tag but not expected hint': function (topic) {
        assert.isEmpty(topic.tags('<link href="/myfeed"/>', 'link', '(atom|rss)\\+xml'));
      },
      'should return empty array when expected tag is undefined': function (topic) {
        assert.isEmpty(topic.tags('<link type="application/atom+xml" href="/myfeed"/>', undefined, '(atom|rss)\\+xml'));
      },
      'should return link tag when expected tag is provided but expected hint is undefined': function (topic) {
        var tags = topic.tags('<link href="/myfeed"/>', 'link', undefined);
        assert.equal(tags.length, 1);
        assert.equal(tags[0], '<link href="/myfeed"/>');
      },
      'should return empty array when text is not provided': function (topic) {
        assert.isEmpty(topic.tags(undefined, 'link', '(atom|rss)\\+xml'));
        assert.isEmpty(topic.tags(null, 'link', '(atom|rss)\\+xml'));
      },
      'should return anchor tag with particular text': function (topic) {
        var tags = topic.tags('<a href="/myfeed"/>RSS</a><a href="/myfeed"/>Atom</a>', 'a', '>RSS<');
        assert.equal(tags.length, 1);
        assert.equal(tags[0], '<a href="/myfeed"/>RSS</a>');
      }
    },
    'attribute': {
      'should return expected attribute value': function (topic) {
        assert.equal(topic.attribute('<link title="My Feed" href="/myfeed"/>', 'href'), '/myfeed');
        assert.equal(topic.attribute('<link title=\'My Feed\' href=\'/myfeed\'/>', 'title'), 'My Feed');
        assert.equal(topic.attribute('<  link   title="My Feed"   href="/myfeed" / >', 'href'), '/myfeed');
        assert.equal(topic.attribute('<  link   title="My Feed"   href="/myfeed" / >', 'title'), 'My Feed');
        assert.equal(topic.attribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'href'), '/myfeed');
        assert.equal(topic.attribute('< \n link   title="My Feed" \n  href="/myfeed" \n >', 'title'), 'My Feed');
      },
      'should return null when the attribute does not exist': function (topic) {
        assert.isNull(topic.attribute('<link title="My Feed" href="/myfeed">', 'blah'));
        assert.isNull(topic.attribute('', 'blah'));
      },
      'should return null when text is not provided': function (topic) {
        assert.isNull(topic.attribute(null, 'blah'));
        assert.isNull(topic.attribute(undefined, 'blah'));
      },
      'should return null when attribute name is not provided': function (topic) {
        assert.isNull(topic.attribute('<link title="My Feed" href="/myfeed">', null));
        assert.isNull(topic.attribute('<link title="My Feed" href="/myfeed">', undefined));
      }
    }
  }
}).exportTo(module);