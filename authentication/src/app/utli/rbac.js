'use strict';

const debug = require('debug')('authentication:ulti:rbac');
const { getUserAccessData } = require('../config/user-access');

function validateRbacForAPI(apiName, apiVerb, user) {
    const userAccessMapping = getUserAccessData();
    debug(`requested url: ${apiName}, method: ${apiVerb}`);
    if (userAccessMapping[apiName]) {
        return userAccessMapping[apiName][apiVerb].indexOf(user.role) !== -1 ? true : false
    }
    return false;
}

module.exports = {
    validateRbacForAPI,
};
