//const wserv = require('./dist/server/js/nlib-express');
const wserv = require('./src/server/js/nlib-express');
const NWebServer = wserv.NWebServer;
const NWebRouter = wserv.NWebRouter;

const server = new NWebServer();
server.opts.app.name = 'nlib-core example';
server.opts.app.version = '0.0.1';
server.opts.app.lastupdated = '2019-01-25';
server.opts.server.port = '3000';

let routes = [
    new NWebRouter('/', (req, res) => { res.send('`/` Success!'); }),
    new NWebRouter('/home', (req, res) => { res.send('`/home` Success!'); }),
    new NWebRouter('/about', (req, res) => { res.send('`/about` Success!'); }),
    new NWebRouter('/contact', (req, res) => { res.send('`/contact` Success!'); }),
    new NWebRouter('/supports', (req, res) => { res.send('`/supports` Success!'); }),
    new NWebRouter('/login')
]

routes.forEach(route => { server.get(route); });

server.get('/logout', (req, res) => {
    res.send('`/logout` Success!');
});

server.start();