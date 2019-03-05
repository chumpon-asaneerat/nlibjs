const helmet = require('helmet');
const EXPRESS = require('../nlib-express');

class Helmet extends EXPRESS.NExpressModule {
    init(server) {
        if (!server || !server.app) return;
        // helmet.
        server.app.use(helmet());
    };
};

exports.Helmet = Helmet;