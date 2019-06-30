const EXPRESS = require('../nlib-express');

class PUGViewEngine extends EXPRESS.NExpressViewModule {
    /**
     * Use View Engine.
     */
    use() {
        // use view engine
        this.server.app.set('view engine', 'pug');
    };
    /**
     * Init and gets View renderer instance.
     * @param {Any} server 
     */
    static init(server) {
        return new NExpressModule.PUG(server);
    };
};

exports.PUGViewEngine = PUGViewEngine;