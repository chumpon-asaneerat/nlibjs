const path = require('path');
const fs = require('fs');

// setup root path. required in main entrypoint js file.
process.env['ROOT_PATHS'] = path.dirname(require.main.filename);
// required for seperate js module to access root path.
const rootPath = process.env['ROOT_PATHS'];

const express = require('express');
// middlewares for expressjs.
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// view engine for expressjs.
const exphbs = require('express-handlebars');
const hbs = exphbs.create();

/**
 * Express Web Server wrapper class.
 */
class NWebServer {
    /**
     * Constructor.
     */
    constructor() {
        //console.log('Root:', rootPath);
        this._opts = {
            app: {
                name: 'My App',
                version: '1.0.0',
                lastupdated: '2019-01-24',
            },
            server: {
                port: process.env.PORT || 3000
            },
            paths: {
                root: rootPath,
                public: path.join(rootPath, 'public'),
                views: path.join(rootPath, 'views')
            }
        };
        // express app instance.
        this._app = express();
        // init basic middlewares.
        this._app.use(logger('dev')); // logger (morgan).
        // helmet.
        this._app.use(helmet());
        // body parser.
        this._app.use(bodyParser.json());
        // extended must be true. If extended is false, you can not post "nested object".
        this._app.use(bodyParser.urlencoded({ extended: true }));
        // cookie parser.
        this._app.use(cookieParser());
    };
    /**
     * GET Method.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    get() {
        if (!this._app) return;
        if (arguments.length >= 1) {
            let isRouter = arguments[0] instanceof NWebRouter;
            let router = (isRouter) ? arguments[0] : new NWebRouter(arguments[0], arguments[1]);
            this._app.get(router.url, router.execute);
        }
    };
    /**
     * POST Method.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    post() {
        if (!this._app) return;
        if (arguments.length >= 1) {
            let isRouter = arguments[0] instanceof NWebRouter;
            let router = (isRouter) ? arguments[0] : new NWebRouter(arguments[0], arguments[1]);
            this._app.post(router.url, router.execute);
        }
    };
    /**
     * ALL Methods.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    all(url, callback) {
        if (!this._app) return;
        if (arguments.length >= 1) {
            let isRouter = arguments[0] instanceof NWebRouter;
            let router = (isRouter) ? arguments[0] : new NWebRouter(arguments[0], arguments[1]);
            this._app.all(router.url, router.execute);
        }
    };
    /**
     * Start server.
     */
    start() {
        if (!this._app) {
            console.log('Express app instance is not assigned.');
            return;
        }
        // if change favicon.ico required to restart server.
        let iconFile = path.join(this._opts.paths.public, 'favicon.ico');
        fs.exists(iconFile, (found) => {
            if (found) {
                this._app.use(favicon(iconFile));
            }
            else {
                console.log(favicon, 'not found.');
            }
        });
        // setup port
        this._app.set('port', process.env.PORT || this._opts.server.port);
        // start server.
        let self = this;
        let server = self._app.listen(self._app.get('port'), () => {
            console.log(self.info + ' listening on port `' + server.address().port + '`');
        });
    };
    /**
     * Gets options.
     */
    get opts() { return this._opts; }
    /**
     * Gets express app instance.
     */
    get app() { return this._app; }
    /**
     * Get app information
     */
    get info() { return '`' + this._opts.app.name + '` v' + this._opts.app.version; }
};

exports.NWebServer = NWebServer;

/**
 * Express Web Route mapping class.
 */
class NWebRouter {
    /**
     * Constructor.
     * @param {String} url.
     * @param {Any} callback.
     */
    constructor(url, callback) {
        this._url = url;
        this._callback = callback;
    };
    /**
     * Gets Url.
     */
    get url() { return this._url; }
    /**
     * Execute route callback function.
     */
    get execute() { 
        let self = this;
        let fn = (req, res, next) => {
            console.log('Request:', req.url);
            if (!self._callback) {
                console.log('Request:', req.url, 'callback not assigned.');
                next();
            }
            else {
                self._callback(req, res, next);
            }
        }
        return fn;
    }
};

exports.NWebRouter = NWebRouter;

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
