var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('handlers').addBatch({
  'handlers': {
    topic: function () {
      return function (mocks) {
        return sandbox.require('../lib/handlers', {
            requires: mocks
          });
      };
    },
    'should enable layout and pass url to locals when home request has param': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com']
        },
        res = {
          render: function (page, params) {
            checks.page = page;
            checks.params = params;
          }
        },
        next,
        locals = {
          foo: 'bar'
        };
      topic({}).home(req, res, next, locals);
      assert.equal(checks.page, 'home.html');
      assert.isTrue(checks.params.layout);
      assert.equal(checks.params.locals.url, 'http://wired.com');
      assert.equal(checks.params.locals.foo, 'bar');
    },
    'should send error response when discover request has an error': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com']
        },
        res = {
          send: function (data, code) {
            checks.data = data;
            checks.code = code;
          }
        },
        next,
        locals;
      topic({
        './feedtouch': {
          FeedTouch: function () {
            return {
              discover: function (url, cb) {
                assert.equal(url, 'http://wired.com');
                cb(new Error('Feed discovery error: dummy error'));
              }
            };
          }
        }
      }).discover(req, res, next, locals);
      assert.equal(checks.data, '{"err":"Feed discovery error: dummy error"}');
      assert.equal(checks.code, 404);
    },
    'should send error response when discover request has unexpected response code': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com']
        },
        res = {
          send: function (data, code) {
            checks.data = data;
            checks.code = code;
          }
        },
        next,
        locals;
      topic({
        './feedtouch': {
          FeedTouch: function () {
            return {
              discover: function (url, cb) {
                assert.equal(url, 'http://wired.com');
                cb(new Error('Feed discovery error: Unexpected status code: 500'));
              }
            };
          }
        }
      }).discover(req, res, next, locals);
      assert.equal(checks.data, '{"err":"Feed discovery error: Unexpected status code: 500"}');
      assert.equal(checks.code, 404);
    },
    'should send result when discover request has no error': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com']
        },
        res = {
          send: function (data, code) {
            checks.data = data;
            checks.code = code;
          }
        },
        next,
        locals;
      topic({
        './feedtouch': {
          FeedTouch: function () {
            return {
              discover: function (url, cb) {
                assert.equal(url, 'http://wired.com');
                cb(null, [{"title":null,"url":"http://host/feed"}]);
              }
            };
          }
        }
      }).discover(req, res, next, locals);
      assert.equal(checks.data, '[{"title":null,"url":"http://host/feed"}]');
      assert.equal(checks.code, 200);
    },
    'should enable layout, pass url and title to locals when article request has param': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com'],
          query: { title: 'Hello World' }
        },
        res = {
          render: function (page, params) {
            checks.page = page;
            checks.params = params;
          }
        },
        next,
        locals = {
          foo: 'bar'
        };
      topic({}).article(req, res, next, locals);
      assert.equal(checks.page, 'article.html');
      assert.isTrue(checks.params.layout);
      assert.equal(checks.params.locals.url, 'wired.com');
      assert.equal(checks.params.locals.title, 'Hello World');
      assert.equal(checks.params.locals.foo, 'bar');
    },
    'should enable layout, pass url and default title to locals when article request has no title query string': function (topic) {
      var checks = {},
        req = {
          params: ['wired.com'],
          query: {}
        },
        res = {
          render: function (page, params) {
            checks.page = page;
            checks.params = params;
          }
        },
        next,
        locals = {
          foo: 'bar'
        };
      topic({}).article(req, res, next, locals);
      assert.equal(checks.page, 'article.html');
      assert.isTrue(checks.params.layout);
      assert.equal(checks.params.locals.url, 'wired.com');
      assert.equal(checks.params.locals.title, 'Untitled');
      assert.equal(checks.params.locals.foo, 'bar');
    },
    'should set brochure layout and keep locals when brochure request is sent': function (topic) {
      var checks = {},
        req,
        res = {
          render: function (page, params) {
            checks.page = page;
            checks.params = params;
          }
        },
        next,
        locals = {
          foo: 'bar'
        };
      topic({}).brochure(req, res, next, locals);
      assert.equal(checks.page, 'brochure.html');
      assert.equal(checks.params.layout, 'layout_brochure');
      assert.equal(checks.params.locals.foo, 'bar');
    }
  }
}).exportTo(module);
