//const wserv = require('./dist/server/js/nlib-express');
const wserv = require('./src/server/js/nlib-express');
const NWebServer = wserv.NWebServer;
const NWebRouter = wserv.NWebRouter;

//const wserv = require('./dist/server/js/nlib-mssql');
const dbsevr = require('./src/server/js/nlib-mssql');
const NMSSql = dbsevr.NMSSql;

const server = new NWebServer();
server.opts.app.name = 'nlib-core example';
server.opts.app.version = '0.0.1';
server.opts.app.lastupdated = '2019-02-04';
server.opts.server.port = '3000';

const dbconfig = {
    server: 'localhost',
    database: 'TestDb7x3',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    user: 'sa',
    password: 'winnt123'
};


class NPage {
    excute(req, res, next) { 
        res.send('`' + req.url + '` NPage execute success!');
    }
};

NPage.home = class extends NPage {
    excute(req, res, next) {
        server.HTML.render(res, 'examples/home');
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
        server.HTML.use();
        server.render(res, 'examples/home');
    }),
    */
    new NWebRouter('/about', (req, res) => { 
        server.PUG.render(res, 'examples/about', { title:'About page.', msg: 'This is about page.' });
    }),
    new NWebRouter('/contact', (req, res) => { 
        server.EJS.render(res, 'examples/contact', { msg: 'This is Contact page.' });
    }),
    new NWebRouter('/supports', (req, res) => { 
        res.send('`/supports` Success!'); 
    }),
    new NWebRouter('/login'),
    new NWebRouter('/db1', (req, res) => { 
        let results = [];
        let mssql = new NMSSql();
        mssql.config = dbconfig;

        let conn = mssql.create();
        let cmd = new NMSSql.DbCommand(conn);

        (async function() {
            await conn.connect();
            let r1 = await cmd.excute();
            await conn.disconnect();
            results.push(r1);
            /*
            let result1 = await conn.request().query('select * from customer');
            console.dir(result1);
            results.push(result1);
            */
            /*
            let result2 = await conn.request().query('select * from org');
            console.dir(result2);
            results.push(result2);
            */
        })();

        res.send('`/test database function 1` Success!\n' + results);
    }),
];

routes.forEach(route => { 
    server.get(route);
});

server.get('/logout', (req, res) => {
    server.HBS.render(res, 'examples/logout', { msg: 'logout page' });
});

server.start();