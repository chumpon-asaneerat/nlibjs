const sql = require('mssql');

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
        let result = null;
        try {
            let conn = new sql.ConnectionPool(this._config); //sql.connect(this._config);
            result = new NMSSql.DbConnection(conn, null);
        }
        catch (err) {
            result = new NMSSql.DbConnection(null, err);
        }
        return result;
    };

    get config() { return this._config; }
    set config(value) { this._config = value; }
};

NMSSql.DbConnection = class {
    constructor(conn, err) {
        this._conn = conn;
        this._err = err;
    };
    connect() {
        if (!this._conn) return;
        this._conn.connect();
    };
    disconnect() {
        if (!this._conn) return;
        this._conn.disconnect();
    };
    get connection() { return this._conn; }
    get err() { return this._err; }
};

NMSSql.DbCommand = class {
    constructor(conn) {
        this._conn = conn
        this._cmdType = 'Query'; // Query or StoredProcedure.
        this._text = ''; // Query text or SP Name.
        this._params = [];
    };

    execute() {
        let result = {};

        if (this._conn) {
            /*
            if (conn) { 
                conn.connect().then((pool) => {
                    return new sql.Request(pool);
                })
            }
            */
            result.data = this._conn.connection;
        }

        return result;
    };

    get connection() { return this._conn; }

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
