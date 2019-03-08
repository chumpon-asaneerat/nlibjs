const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

//--
// REQUIRED TO MOVE CODE THAT WORK WITH COOKIES, QUERYSTRING, etc to NLib-Core.
//--
parseCookie = (req, name) => {
    return (req.cookies && req.cookies[name]) ? req.cookies[name] : null;
};

exports.parse = parseCookie;

storeCookie = (res, name, data, opts) =>  {
    if (opts) {
        res.cookie(name, data, opts);
    }
    else {
        res.cookie(name, data, { httpOnly: true });
    }
};

exports.store = storeCookie;


class NJwtService {
    validateDevice(req, res, next) {
        let name = `x-device`;
        let data = parseCookie(req, name);
        if (!data) {
            let token = uuidv4();
            storeCookie(res, name, token);
        }
        next();
    };
    signin(req, res, next) {
    };
    signout(req, res, next) {
    };

};

exports.NJwtService = NJwtService;