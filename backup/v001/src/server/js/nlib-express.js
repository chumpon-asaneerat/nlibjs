const path = require('path');
const fs = require('fs');

// setup root path. required in main entrypoint js file.
process.env['ROOT_PATHS'] = path.dirname(require.main.filename);
// required for seperate js module to access root path.
const rootPath = process.env['ROOT_PATHS'];

const express = require('express');

//#region NExpressModule and related classes

//#region NExpressModule (namespace)

class NExpressModule { }

//#endregion

//#region Express Middleware modules

//#region Helmet

const helmet = require('helmet');

/**
 * Helmet.
 */
NExpressModule.Helmet = class {
    static init(server) {
        if (!server || !server.app) return;
        // helmet.
        server.app.use(helmet());
    };
};

//#endregion

//#region Logger

const logger = require('morgan');

/**
 * Logger (morgan).
 */
NExpressModule.Logger = class {
    static init(server) {
        if (!server || !server.app) return;
        // logger (morgan).
        server.app.use(logger('dev'));
    };
};

//#endregion

//#region Body Parser

const bodyParser = require('body-parser');

/**
 * Body Parser.
 */
NExpressModule.BodyParser = class {
    static init(server) {
        if (!server || !server.app) return;
        // body parser.
        server.app.use(bodyParser.json());
        // extended must be true. If extended is false, you can not post "nested object".
        server.app.use(bodyParser.urlencoded({ extended: true }));
    };
};

//#endregion

//#region Cookie Parser

const cookieParser = require('cookie-parser');

/**
 * Cookie Parser.
 */
NExpressModule.CookieParser = class {
    static init(server) {
        if (!server || !server.app) return;
        // cookie parser.
        server.app.use(cookieParser());
    };
};

//#endregion

//#region Static Paths

/**
 * Static Paths.
 */
NExpressModule.StaticPaths = class {
    static init(server) {
        if (!server || !server.app) return;
        console.log('init common static paths....');
        // max-age variables
        let libMaxAge = { maxage: '15s' };
        // path variables
        let publicPath = server.opts.paths.public;
        let commonPath = path.join(publicPath, 'lib');
        let assetPath = path.join(publicPath, 'assets');
        let imagePath = path.join(assetPath, 'images');
        let videoPath = path.join(assetPath, 'videos');
        let audioPath = path.join(assetPath, 'audios');        

        // common lib paths.
        server.app.use('/lib', express.static(commonPath, libMaxAge));
        // public paths.
        server.app.use('/public', express.static(publicPath));
        // public->assets paths.
        server.app.use('/images', express.static(imagePath));
        server.app.use('/videos', express.static(videoPath));
        server.app.use('/audios', express.static(audioPath));
    };
};

//#endregion

//#region Third Party Lib Paths

/**
 * ThirdParty Lib Paths.
 */
NExpressModule.ThirdPartyLibPaths = class {
    static init(server) {
        if (!server || !server.app) return;
        // max-age variables
        let distMaxAge = { maxage: '1d' };
        // path variables
        let cfgPath = server.opts.paths.config;
        let publicPath = server.opts.paths.public;
        let distPath = path.join(publicPath, 'dist');
        let distCfgFile = path.join(cfgPath, 'dist.json');

        try {
            let obj = fs.readFileSync(distCfgFile, 'utf8');
            if (obj) {
                let dist_libs = JSON.parse(obj);
                dist_libs.forEach(el => {
                    let localPath = el.path;
                    console.log('publish `' + localPath + '`');                    
                    let eachPath = path.join(distPath, localPath);
                    server.app.use(el.route, express.static(eachPath, distMaxAge));
                });
            }
        }
        catch (err) {
            console.error(err);
        };
    };
};

//#endregion

//#region FavIcon

const favicon = require('serve-favicon');

/**
 * favicon.
 */
NExpressModule.FavIcon = class {
    static init(server) {
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

//#endregion

//#endregion

//#region View Engines

//#region NExpressViewModule (Base class)

NExpressModule.NExpressViewModule = class {
    /**
     * Constructor.
     * @param {Any} server 
     */
    constructor(server) {
        this._server = server;
    };
    /**
     * Use View Engine.
     */
    use() { };
    /**
     * Render view.
     * @param {Any} res 
     * @param {String} viewFile 
     * @param {Object} opts 
     */
    render(res, viewFile, opts) {
        if (!this._server || !this._server.app) return;        
        // use current view engine.
        this.use();
        // render file.
        let viewPath = this._server.opts.paths.views;
        let target = path.join(viewPath, viewFile);
        res.render(target, opts);
    };
    /**
     * Gets server instance.
     */
    get server() { return this._server; }
}

//#endregion

//#region Handlebars

const exphbs = require('express-handlebars'); // for HBS (Handlebars)
const hbs = exphbs.create();

/**
 * Handlebar.
 */
NExpressModule.Handlebar = class extends NExpressModule.NExpressViewModule {
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

//#endregion

//#region EJS

/**
 * EJS.
 */
NExpressModule.EJS = class extends NExpressModule.NExpressViewModule {
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

//#endregion

//#region PUG/Jade

/**
 * PUG/Jade.
 */
NExpressModule.PUG = class extends NExpressModule.NExpressViewModule {
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

//#endregion

//#region HTML

const cons = require('consolidate'); // for HTML

/**
 * HTML.
 */
NExpressModule.HTML = class extends NExpressModule.NExpressViewModule {
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

//#endregion

//#endregion

//#endregion

//#region NWebServer

/**
 * Express Web Server wrapper class.
 */
class NWebServer {
    //#region Constructor

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
                config: path.join(rootPath, 'configs'),
                public: path.join(rootPath, 'public'),
                views: path.join(rootPath, 'views')
            }
        };
        // express app instance.
        this._app = express();
        this._server = null;
        // init basic middlewares.
        NExpressModule.Logger.init(this); // Logger (morgan).
        NExpressModule.Helmet.init(this); // helmet.
        NExpressModule.BodyParser.init(this); // body parser.
        NExpressModule.CookieParser.init(this); // cookie parser.
        // Init View Engine render.
        this.HBS = NExpressModule.Handlebar.init(this); // HBS View Engine.
        this.EJS = NExpressModule.EJS.init(this); // EJS View Engine.
        this.PUG = NExpressModule.PUG.init(this); // PUG View Engine.
        this.HTML = NExpressModule.HTML.init(this); // HTML View Engine.
    };

    //#endregion

    //#region GET/POST/ALL

    /**
     * GET Method.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    get() {
        let router = NWebRouter.parse(...arguments);
        if (!router) return;
        this._app.get(router.url, router.execute);
    };
    /**
     * POST Method.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    post() {
        let router = NWebRouter.parse(...arguments);
        if (!router) return;
        this._app.post(router.url, router.execute);
    };
    /**
     * ALL Methods.
     * 
     * @param {String} url 
     * @param {Express router callback} callback 
     */
    all() {
        let router = NWebRouter.parse(...arguments);
        if (!router) return;
        this._app.all(router.url, router.execute);
    };

    //#endregion
    
    //#region Start

    /**
     * Start server.
     */
    start() {
        NExpressModule.StaticPaths.init(this);
        NExpressModule.FavIcon.init(this);
        NExpressModule.ThirdPartyLibPaths.init(this);
        // setup port
        this._app.set('port', process.env.PORT || this._opts.server.port);
        // start server.
        let msg = this.info;
        this._server = this._app.listen(this._app.get('port'), () => {
            console.log(msg + ' listening on port `' + server.address().port + '`');
        });
    };

    //#endregion

    //#region public properties

    /**
     * Gets options.
     */
    get opts() { return this._opts; }
    /**
     * Gets express app instance.
     */
    get app() { return this._app; }
    /**
     * Gets express listener server instance.
     */
    get server() { return this._server; }
    /**
     * Get app information
     */
    get info() { return '`' + this._opts.app.name + '` v' + this._opts.app.version; }

    //#endregion
};

exports.NWebServer = NWebServer;

//#endregion

//#region NWebRouter

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
            //console.log('Request:', req.url);
            if (!self._callback) {
                //console.log('Request:', req.url, 'callback not assigned.');
                if (next) next();
            }
            else {
                self._callback(req, res, next);
            }
        }
        return fn;
    }
    /**
     * Parse arguments for NWebRouter instance.
     */
    static parse() {
        let router = null;
        if (arguments.length >= 1) {
            let isRouter = arguments[0] instanceof NWebRouter;
            router = (isRouter) ? arguments[0] : new NWebRouter(arguments[0], arguments[1]);            
        }
        return router;
    };
};

exports.NWebRouter = NWebRouter;

//#endregion
