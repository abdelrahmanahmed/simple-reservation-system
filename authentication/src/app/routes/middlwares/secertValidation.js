'use strict';

const debug = require('debug')('authentication:app:api:middlewares:secretValidation');
const config = require('../../config/app');

module.exports = (req, res, next) => {
    if (req.headers && req.headers.appsecret && req.headers.appsecret === config.appSecret) {
        debug('request is authorized');
        next();
    }
    else {
        debug('unauthorized request');
        return res.status(401).send('unauthorized');
    }
}