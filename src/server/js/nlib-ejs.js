const path = require('path');
const fs = require('fs');

// required for seperate js module to access root path.
const rootPath = process.env['ROOT_PATHS'];

const render = require('./nlib-renderer');