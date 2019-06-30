const helmet = require('./middlewares/helmet');
const logger = require('./middlewares/logger');
const bodyParser = require('./middlewares/body-parser');
const cookieParser = require('./middlewares/cookie-parser');
const favicon = require('./middlewares/favicon');

let viewEngines = {};
viewEngines.HTML = require('./middlewares/html-view-engine').HTMLViewEngine;
viewEngines.PUG = require('./middlewares/pug-view-engine').PUGViewEngine;
viewEngines.EJS = require('./middlewares/ejs-view-engine').EJSViewEngine;
viewEngines.HBS = require('./middlewares/handlebar-view-engine').HandlebarViewEngine;

module.exports = (websvr) => {
    websvr.use(helmet());
    websvr.use(logger());
    websvr.use(bodyParser());
    websvr.use(cookieParser());
    websvr.use(favicon());

    websvr.view.HTML = new viewEngines.HTML(websvr);
    websvr.view.PUG = new viewEngines.PUG(websvr);
    websvr.view.EJS = new viewEngines.EJS(websvr);
    websvr.view.HBS = new viewEngines.HBS(websvr);
};