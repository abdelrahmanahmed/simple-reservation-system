const axios = require('axios');
const debug = require('debug')('reservation:app:api:middlewares:authorization');
const config = require('../../config/app');

module.exports = async (req, res, next) => {
    debug('validate user authorization');
    try {
        debug('request is authorized to hit: ', req.url);
        const result = await axios({
            url: `${config.authentication.url}/${config.authentication.authorizeEndpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                appSecret: config.appSecret,
            },
            data: {
                apiName: req.url,
                apiHttpVerb: req.method,
                user: req.body
            },
        });

        if (result.status === 200) {
            debug('Authorized');
            res.locals.user = result.data;
            next();
        }
        else {
            debug('unauthorized request');
            return res.status(401).send('unauthorized');
        }
    }
    catch (error) {
        debug('cant send request to authentication', error.message);
        return res.status(401).send(error.message);
    }
}