const path = require('path');
const nlib = require('./src/server/js/nlib-core');
const nexpress = require('./src/server/js/nlib-express');
const websvr = new nexpress.NWebServer();

const helmet = require('./src/server/js/middlewares/helmet').Helmet;
const logger = require('./src/server/js/middlewares/logger').Logger;
const bodyParser = require('./src/server/js/middlewares/body-parser').BodyParser;
const cookieParser = require('./src/server/js/middlewares/cookie-parser').CookieParser;

websvr.init(new helmet());
websvr.init(new logger());
websvr.init(new bodyParser());
websvr.init(new cookieParser());

websvr.app.get('/', (req, res) => {
    console.log('body', req.body);
    console.log('query', req.query);
    //console.log(res);
    res.send('Work!.');
});

websvr.app.post('/api1', (req, res) => {
    console.log('body', req.body);
    console.log('query', req.query);
    //console.log(res);
    res.send('api1: Work!.');
});


websvr.start();

/*
const jwt = require('jsonwebtoken');
const jwt_key = 'secret_key'

const checkDevice = (req, res, next) => {
    next(); // success.
};

const checkAuth = (req, res, next) => {
    try {
        //let token = req.body.token;
        //let token = req.headers['authorization'];
        let token = req.cookies['authorization'];
        let key = jwt_key;
        console.log(token);
        let decoded = jwt.verify(token, key);
        req.userData = decoded;
        next(); // success.
    }
    catch (err) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }    
};

app.get('/', (req, res) => {
    console.log('body', req.body);
    //console.log(res);
    res.send('Work!.');
});

app.get('/login', (req, res) => {
    let payload = {
        userid: '',
        data: '',
    };
    let key = jwt_key;
    let token = jwt.sign(payload, key);
    console.log('token', token);
    //res.setHeader('authorization', 'Bearer ' + token)
    //req.headers['authorization'] = 'Bearer ' + token;

    res.cookie('user', 'xuser', { maxAge: 900000, httpOnly: false });

    res.cookie('authorization', token, { maxAge: 900000, httpOnly: true });
    res.json({ 'token': token});
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
exclusiveRoute.get('/report', checkAuth, (req, res) => {
    res.send('exclusive report page.');    
});
app.use('/exclusive', exclusiveRoute);

// http start listen request.
let http = app.listen(port, () => {
    console.log('listen on port:', port);
});

*/

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

