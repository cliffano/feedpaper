var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('routes').addBatch({
  'route': {
    topic: function () {
      return function (path, mocks) {
        var routes = sandbox.require('../lib/routes', {
        	  requires: {
        	  	'./handlers': mocks
        	  }
          }).routes,
          _route;
        routes.forEach(function (route) {
          if (route.path === path) {
            _route = route;
          }  
        });
        return _route;
      }
    },
    'should have brochure route': function (topic) {
      var route = topic('/', { brochure: function () { return 'dummy brochure'; }});
      assert.equal(route.method, 'get');
      assert.equal(route.cb(), 'dummy brochure');
    },
    'should have article route': function (topic) {
      var route = topic('/a/*?', { article: function () { return 'dummy article'; }});
      assert.equal(route.method, 'get');
      assert.equal(route.cb(), 'dummy article');
    },
    'should have discover route': function (topic) {
      var route = topic('/s/*?', { discover: function () { return 'dummy feed'; }});
      assert.equal(route.method, 'get');
      assert.equal(route.cb(), 'dummy feed');
    },
    'should have home route': function (topic) {
      var route = topic('/*', { home: function () { return 'dummy page'; }});
      assert.equal(route.method, 'get');
      assert.equal(route.cb(), 'dummy page');
    }
  }
}).exportTo(module);