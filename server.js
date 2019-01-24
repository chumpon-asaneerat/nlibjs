//const wserv = require('./dist/server/js/nlib-express');
const wserv = require('./src/server/js/nlib-express');

const NWebServer = wserv.NWebServer;
const NWebRouter = wserv.NWebRouter;

const server = new NWebServer();
server.opts.app.name = 'nlib-core example';
server.opts.app.version = '0.0.1';
server.opts.app.lastupdated = '2019-01-25';
server.opts.server.port = '3000';

const NRenderer = wserv.NWebRenderer;
const HBS = new NRenderer.HBS(server);
const EJS = new NRenderer.EJS(server);
const PUG = new NRenderer.PUG(server);
const HTML = new NRenderer.HTML(server);

class NPage {
    excute(req, res, next) { 
        res.send('`' + req.url + '` NPage execute success!');
    }
};

NPage.home = class extends NPage {
    excute(req, res, next) {
        HTML.render(res, 'examples/home');
    }
};

let routes = [
    new NWebRouter('/', new NPage().excute),
    /*
    new NWebRouter('/', (req, res) => { 
        res.send('`/` Success!');
    }),
    */
   new NWebRouter('/home', new NPage.home().excute),
   /*
    new NWebRouter('/home', (req, res) => { 
        HTML.render(res, 'examples/home');
    }),
    */
    new NWebRouter('/about', (req, res) => { 
        PUG.render(res, 'examples/about', { title:'About page.', msg: 'This is about page.' });
    }),
    new NWebRouter('/contact', (req, res) => { 
        EJS.render(res, 'examples/contact', { msg: 'This is Contact page.' });
    }),
    new NWebRouter('/supports', (req, res) => { 
        res.send('`/supports` Success!'); 
    }),
    new NWebRouter('/login')
]

routes.forEach(route => { 
    server.get(route);
});

server.get('/logout', (req, res) => {
    HBS.render(res, 'examples/logout', { msg: 'logout page' });
});

server.start();