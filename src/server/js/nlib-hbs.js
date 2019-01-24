const path = require('path');
const fs = require('fs');

// required for seperate js module to access root path.
const rootPath = process.env['ROOT_PATHS'];

const render = require('./nlib-renderer');

// view engine for expressjs.
const exphbs = require('express-handlebars');
const hbs = exphbs.create();

class HBSRenderer {
    constructor(server, res) {
        this._server = server;
        this._res = res;
    };

    render(path, opts) {

    };

    get server() { return this._server; }
    get response() { return this._res; }
};