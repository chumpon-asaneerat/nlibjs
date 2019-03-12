const path = require('path');
//const fs = require('fs');
const nlib = require('./nlib-core');
const rootPath = nlib.paths.root;
const express = require('express');

class NExpressModule {
    // virtual method.
    init(server) { };
    // readonly property.
    get server() { return this._server; }
    get app() {
        if (!this._server) return null;
        return this._server.app;
    }
};

module.exports.NExpressModule = exports.NExpressModule = NExpressModule;

class NExpressViewModule {
    constructor(server) {
        this._server = server;
    };
    use() {};
    render(res, viewFile, opts) {
        if (!this._server || !this._server.app) return;        
        // use current view engine.
        this.use();
        // render file.
        let viewPath = this._server.opts.paths.views;
        let target = path.join(viewPath, viewFile);
        res.render(target, opts);
    };
    get server() { return this._server; }
};

module.exports.NExpressViewModule = exports.NExpressViewModule = NExpressViewModule;

class NWebServer {
    constructor() {
        this._app = new express();
        this._httpSvr = null;
        this._opts = {
            app: {
                name: 'My App',
                version: '1.0.0',
                lastupdated: '2019-03-05',
            },
            server: {
                port: 3000
            },
            paths: {
                root: rootPath,
                config: path.join(rootPath, 'configs'),
                public: path.join(rootPath, 'public'),
                views: path.join(rootPath, 'views')
            }
        };
        this._view = {};
    };
    use(middleware) {
        if (!middleware && !middleware.init) {
            console.log('middleware not implements init function.');
            return;
        }
        middleware.init(this);
    };
    start() {
        let port = process.env.PORT || this._opts.server.port;
        // setup port
        this._app.set('port', port);
        // start server.
        let msg = this.info + ' listening on port: `' + port + '`';
        this._httpSvr = this._app.listen(port, () => {
            console.log(msg);
        });
    };

    get app() { return this._app; }
    get opts() { return this._opts; }
    get middlewares() { return this._middlewares; }
    get httpServer() { return this._httpSvr; }
    get info() { return '`' + this._opts.app.name + '` v' + this._opts.app.version; }
    get view() { return this._view; }
};

module.exports.NWebServer = exports.NWebServer = NWebServer;

class NCookie {
    static parse(req, name) {
        return (req && req.cookies && req.cookies[name]) ? req.cookies[name] : null;
    };
    static store(res, name, data, opts) {
        if (!res) return;
        if (opts) {
            res.cookie(name, data, opts);
        }
        else {
            res.cookie(name, data, { httpOnly: true });
        }
    };
};

module.exports.NCookie = exports.NCookie = NCookie;
