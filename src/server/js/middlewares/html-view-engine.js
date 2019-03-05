const EXPRESS = require('../nlib-express');
const cons = require('consolidate'); // for HTML

class HTMLViewEngine extends EXPRESS.NExpressViewModule {
    /**
     * Use View Engine.
     */
    use() {
        // seting engine.
        this.server.app.engine('html', cons.hogan);
        // use view engine
        this.server.app.set('view engine', 'html');
    };
    /**
     * Init and gets View renderer instance.
     * @param {Any} server 
     */
    static init(server) {
        return new NExpressModule.HTML(server);
    };
};

exports.HTMLViewEngine = HTMLViewEngine;