const cookieParser = require('cookie-parser');
const EXPRESS = require('../nlib-express');

class CookieParser extends EXPRESS.NExpressModule {
    init(server) {
        if (!server || !server.app) return;
        // cookie parser.
        server.app.use(cookieParser());
    };
};

exports.CookieParser = CookieParser;