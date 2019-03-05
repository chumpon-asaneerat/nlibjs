//const path = require('path');
//const fs = require('fs');
//const nlib = require('./nlib-core');

//const rootPath = nlib.paths.root;

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

exports.NExpressModule = NExpressModule;

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
            }
        }
    };

    init(middleware) {
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
    get httpServer() { return this._httpSvr; }
};

exports.NWebServer = NWebServer;
