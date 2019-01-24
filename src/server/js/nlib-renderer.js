const path = require('path');
const fs = require('fs');
// required for seperate js module to access root path.
const rootPath = process.env['ROOT_PATHS'];

// view engine for expressjs.
const exphbs = require('express-handlebars');
const hbs = exphbs.create();

/**
 * Base express view engine renderer.
 */
class NWebRenderer {
    constructor(server) {
        this._server = server;
        this._app = (server) ? server.app : null;
    };
    /**
     * Setup view engine.
     * 
     * @param {*} app The Express App.
     */
    setup(app) { };
    /**
     * Render view file.
     * 
     * @param {Object} res The response object.
     * @param {String} path The view path (relative with views's path).
     * @param {Object} opts The view render options.
     */
    render(res, viewFile, opts) {
        if (!this._app) {
            res.status(501).send('Internal Error. Express app instance not found.');
        }
        this.setup(this._app);
        let target = path.join(this.viewPath, viewFile);
        res.render(target, opts);
    };
    /**
     * Gets server instance.
     */
    get server() { return this._server; }
    /**
     * Gets Express app instance.
     */
    get app() { return this._app; }
    /**
     * Gets Views's path.
     */
    get viewPath() { return this._server.opts.paths.views; };
};

exports.NWebRenderer = NWebRenderer;

/**
 * The Handlebar Renderer.
 */
NWebRenderer.HBS = class extends NWebRenderer {
    /**
     * setup view engine.
     * @param {*} app The Express App.
     */
    setup(app) {
        if (!app) return;
        app.engine('handlebars', hbs.engine)
        app.set('view engine', 'handlebars');
    };
};

//exports.NWebRenderer.HBS = NWebRenderer.HBS;

/**
 * The EJS Renderer.
 */
NWebRenderer.EJS = class extends NWebRenderer {
    /**
     * setup view engine.
     * @param {*} app The Express App.
     */
    setup(app) {
        if (!app) return;
        app.set('view engine', 'ejs');
    };
};

//exports.NWebRenderer.EJS = NWebRenderer.EJS;

/**
 * The PUG Renderer.
 */
NWebRenderer.PUG = class extends NWebRenderer {
    /**
     * setup view engine.
     * @param {*} app The Express App.
     */
    setup(app) {
        if (!app) return;
        app.set('view engine', 'pug');
    };
};

//exports.NWebRenderer.PUG = NWebRenderer.PUG;
