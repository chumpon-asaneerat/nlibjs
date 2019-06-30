const path = require('path');
const fs = require('fs');

const favicon = require('serve-favicon');
const EXPRESS = require('../nlib-express');

class FavIcon extends EXPRESS.NExpressModule {
    init(server) {
        if (!server || !server.app) return;
        // if change favicon.ico required to restart server.
        let iconFile = path.join(server.opts.paths.public, 'favicon.ico');
        fs.exists(iconFile, (found) => {
            if (found) {
                server.app.use(favicon(iconFile));
            }
            else {
                console.log(favicon, 'not found.');
            }
        });
    };
};

module.exports = () => { return new FavIcon(); };
