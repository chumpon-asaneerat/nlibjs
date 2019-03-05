const bodyParser = require('body-parser');
const EXPRESS = require('../nlib-express');

class BodyParser extends EXPRESS.NExpressModule {
    init(server) {
        if (!server || !server.app) return;
        // parse various different custom JSON types as JSON
        server.app.use(bodyParser.json());
        //server.app.use(bodyParser.json({ type: 'application/*+json' }));
        // parse application/x-www-form-urlencoded
        // extended must be true. If extended is false, you can not post "nested object".
        server.app.use(bodyParser.urlencoded({ extended: true }));
        // parse some custom thing into a Buffer. If error remove below line
        //server.app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
        // parse an HTML body into a string. If error remove below line
        //server.app.use(bodyParser.text({ type: 'text/html' }));
    };
};

exports.BodyParser = BodyParser;