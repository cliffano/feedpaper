var handlers = require('./handlers');

exports.routes = [
  { method: 'get', path: '/', cb: handlers.brochure },
  { method: 'get', path: '/a/*?', cb: handlers.article },
  { method: 'get', path: '/s/*?', cb: handlers.discover },
  { method: 'get', path: '/*', cb: handlers.home }
];