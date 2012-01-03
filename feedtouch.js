var routes = require('./lib/routes').routes,
  Ute = require('ute').Ute,
  ute = new Ute({
    name: 'feedtouch',
    port: 28200,
    routes: routes
  });

ute.run();