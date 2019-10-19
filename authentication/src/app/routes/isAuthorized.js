'use strict';
const router = require('express').Router();
const debug = require('debug')('authentication:routes:isAuthorized');
const { Users } = require('../services/usersService');
const { validateRbacForAPI } = require('../utli/rbac');


const isAuthorized = async (req, res, next) => {
  debug('authentication:api:routes:isAuthorized');
  try {
    const user = await Users.getUser(req.body.user.user_id);
    if (validateRbacForAPI(req.body.apiName, req.body.apiHttpVerb, user)) {
      return res.status(200).send(user);
    }
    return res.status(401).send("Unauthorized");
  }
  catch (error) {
    debug('error while getting user details', error);
    return res.status(400).send();
  }
};

router.post('/authorize', isAuthorized);

module.exports = router;