const path = require('path');
const fs = require('fs');

// setup root path. only call once when module load (require).
process.env['ROOT_PATHS'] = path.dirname(require.main.filename);
const rootPath = process.env['ROOT_PATHS'];

let paths = {
    root: rootPath,
    configs: path.join(rootPath, 'configs'),
    public: path.join(rootPath, 'public')    
};

// exports common paths object.
exports.paths = paths;

class NFile {
    constructor() {
        this._fileName = '';
    };

    get fileName() { return this._fileName; }
    set fileName(value) { this._fileName = value; }
    get exists() { return NFule.exists(this._fileName); };

    static exists(fileName) { return fs.existsSync(fileName); };
};

exports.NFile = NFile

class NJson extends NFile {
    constructor() {
        super();
        this._data = null;
    };

    load() {
        this._data = NJson.load(this.fileName);
    };
    save() {
        NJson.save(this.fileName, this._data);
    };

    get data() { return this._data; }
    set data(value) { this._data = value; }

    static load(fileName) {
        let result = null;
        try {
            let obj = fs.readFileSync(fileName, 'utf8');
            result = (obj) ? JSON.parse(obj) : null;
        }
        catch (err) {
            console.log('\x1b[1;31m' + 'load file: `' + fileName + '`, error: ', err.message, '\x1b[0m');
            result = null;
        }
        return result;
    };
    static save(fileName, jsonObj) {
        try {
            let sObj = (jsonObj) ? JSON.stringify(jsonObj, null, 2) : '';
            fs.writeFileSync(fileName, sObj, 'utf8');
        }
        catch (err) {
            console.log('\x1b[1;31m' + 'save file: `' + fileName + '`, error: ', err.message, '\x1b[0m');
        }
    };
};

exports.NJson = NJson;
