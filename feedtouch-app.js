var route = require('./lib/feedtouch/route'),
    Ute = require('ute').Ute,
    ute = new Ute({
        err404: false
    });

ute.start(route.routes);