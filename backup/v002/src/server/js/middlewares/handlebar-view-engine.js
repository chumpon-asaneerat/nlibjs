const exphbs = require('express-handlebars'); // for HBS (Handlebars)
const hbs = exphbs.create();
const EXPRESS = require('../nlib-express');

class HandlebarViewEngine extends EXPRESS.NExpressViewModule {
    /**
     * Use View Engine.
     */
    use() {
        // seting engine.
        this.server.app.engine('handlebars', hbs.engine)
        // use view engine
        this.server.app.set('view engine', 'handlebars');
    };
    /**
     * Init and gets View renderer instance.
     * @param {Any} server 
     */
    static init(server) {
        return new NExpressModule.Handlebar(server);
    };
};

exports.HandlebarViewEngine = HandlebarViewEngine;