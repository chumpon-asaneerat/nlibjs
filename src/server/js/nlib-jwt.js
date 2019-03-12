const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const ncookie = require('./nlib-express').NCookie;

class NJwtService {
    validateDevice(req, res, next) {
        let name = `x-device`;
        let data = ncookie.parse(req, name);
        if (!data) {
            let token = uuidv4();
            ncookie.store(res, name, token);
        }
        next();
    };
    signin(req, res, next) {
    };
    signout(req, res, next) {
    };

};

exports.NJwtService = NJwtService;