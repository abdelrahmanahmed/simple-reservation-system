'use strict';

const debug = require('debug')('reservation:app:api:middlewares:tokenValidation');
const config = require('../../config/app');

module.exports = (req, res, next) => {
    debug('validate api secert token');
    if (req.headers && req.headers.apisecert && req.headers.apisecert === config.apiSecert) {
        debug('request is authorized');
        next();
    }
    else {
        debug('unauthorized request');
        return res.status(401).send('unauthorized');
    }
}