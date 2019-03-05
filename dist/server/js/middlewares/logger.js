const logger = require('morgan');
const EXPRESS = require('../nlib-express');

class Logger extends EXPRESS.NExpressModule {
    init(server) {
        if (!server || !server.app) return;
        // cookie parser.
        server.app.use(logger('dev'));
    };
};

exports.Logger = Logger;