const path = require('path');
const nlib = require('./src/server/js/nlib-core');

const express = require('express');
const app = new express();
const port = 3000;

const logger = require('morgan');
app.use(logger('dev'));

const bodyParser = require('body-parser');
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

app.get('/', (req, res) => {
    console.log('body', req.body);
    //console.log(res);
    res.send('Work!.');
});

// admin router.
const adminRoute = new express.Router();
adminRoute.get('/', (req, res) => {
    //res.send('admin home page.');
    res.redirect('/admin/manage');
});
adminRoute.get('/manage', (req, res) => {
    res.send('admin manage.');
});
adminRoute.get('/design', (req, res) => {
    res.send('admin design page.');
});
app.use('/admin', adminRoute);

// exclusive router.
const exclusiveRoute = new express.Router();
exclusiveRoute.get('/', (req, res) => {
    res.send('exclusive home page.');    
});
exclusiveRoute.get('/report', (req, res) => {
    res.send('exclusive report page.');    
});
app.use('/exclusive', exclusiveRoute);

// http start listen request.
let http = app.listen(port, () => {
    console.log('listen on port:', port);
});

/*
const NJson = nlib.NJson;
const express = require('./src/server/js/nlib-express');

//console.log('nlib root path var:', nlib.paths.root);
let configFile = path.join(nlib.paths.configs, 'express.module.json');
let defaults = {};
let config = defaults.config = {
    modules: [ 'body-parser', 'cookie-parser' ],
    paths: {
        public: 'public'
    }
};

config = null;
//NJson.save(configFile, defaults.config);
config = NJson.load(configFile);

console.log(config);
*/

