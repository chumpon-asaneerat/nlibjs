const sql = require('mssql');
const nlib = require('./nlib-core');
const NResult = nlib.NResult;


/*
const conn = {
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
*/

// Promise
// pool.request().input().query('query') => return promise
// pool.request().input().output.execute('spname') => return promise

// Callback
// pool.request().input().query('query', (err, result) => { })
// pool.request().input().output.execute('spname', (err, result) => { })

class NMSSql {
    constructor(config) {
        this._config = config;
    };

    create() {
        let result = new NMSSql.DbCommand(this._config);
        return result;
    };

    get config() { return this._config; }
    set config(value) { this._config = value; }
};

NMSSql.DbCommand = class {
    constructor(config) {
        this._config = config
        this._cmdType = 'Query'; // Query or StoredProcedure.
        this._text = ''; // Query text or SP Name.
        this._params = [];
    };

    execute() {
        let promise = new Promise((resolve, reject) => {
            let result = new NResult();
            try {                
                let conn = new sql.ConnectionPool(this._config);
                //let conn = new sql.ConnectionPool();
                conn.connect(connErr => {
                    if (connErr) {
                        result.error(null, null, connErr);
                        reject(result);
                    }
                    //else {
                        let dbReq = new sql.Request(conn);
                        for (let x = 0; x < 2; x++) {
                            dbReq.input('name' + x.toString(), sql.NVarChar(50) ,x);
                        }
                        //console.log(dbReq);
                        dbReq.query('select * from customerx', (execErr, dbResult) => {
                            if (execErr) {
                                result.error(null, null, execErr);
                            }
                            else {
                                let rs = dbResult.recordsets;
                                console.log('rs:', rs)
                                let rows = (rs && rs.length > 0) ? rs[0] : [];
                                console.log('rows:', rows)
                                result.result(rows);
                            }
                            resolve(result);
                        });
                    //}
                });                
            }
            catch (err) {
                result.error(null, null, err)
                reject(result);
            }
        });

        return promise;
    };

    get commandType() { return this._cmdType; }
    set commandType(value) { this._cmdType = value; }

    get text() { return this._text; }
    set text(value) { this._text = value; }

    get parameters() { return this._params; }
};

NMSSql.DbParameter = class {
    constructor() {
        this._name = '';
        this._dbtype = 'nvarchar(50)';
        this._type = String;
        this._value = null;
        this._dirt = 'input'; // or output
    };

    get name() { return this._name; }
    set name(value) { this._name = value; }

    get DbType() { return this._dbtype; }
    set DbType(value) { this._dbtype = value; }

    get type() { return this._type; }
    set type(value) { this._type = value; }

    get direction() { return this._dirt; }
    set direction(value) { this._dirt = value; }

    get value() { return this._value; }
    set value(data) { this._value = data; }
};

exports.NMSSql = NMSSql;
