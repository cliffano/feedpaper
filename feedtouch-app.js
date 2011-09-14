var route = require('./lib/feedtouch/route'),
    Ute = require('ute').Ute,
    ute = new Ute({
        err404: false
    });

module.exports = ute.app(route.routes);