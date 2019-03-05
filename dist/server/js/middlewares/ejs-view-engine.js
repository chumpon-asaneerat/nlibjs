const EXPRESS = require('../nlib-express');

class EJSViewEngine extends EXPRESS.NExpressViewModule {
    /**
     * Use View Engine.
     */
    use() {
        // use view engine
        this.server.app.set('view engine', 'ejs');
    };
    /**
     * Init and gets View renderer instance.
     * @param {Any} server 
     */
    static init(server) {
        return new NExpressModule.EJS(server);
    };
};

exports.EJSViewEngine = EJSViewEngine;
