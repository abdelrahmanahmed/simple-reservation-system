'use strict';
const router = require('express').Router();
const debug = require('debug')('authentication:api:routes:subtractUserBonus');
const Joi = require('joi');
const { Users } = require('../services/usersService');

const validateRequest = (req, res, next) => {
  debug('Request Validation', req.body);
  const schema = Joi.object().keys({
    user_id: Joi.required(),
    bonus: Joi.required(),
  });

  const result = schema.validate(req.body);
  if (!result.error) {
    debug('validation successful');
    return next();
  }
  debug('validation error', result.error);
  return res.status(400).send("BAD REQUEST");
};

const subtractUserBonus = async (req, res, next) => {
  debug('Update User Bonus');
  try {
    const result = await Users.subtractUserBonus(req.body.user_id, req.body.bonus);
    return res.send(result).status(200);
  }
  catch (error) {
    debug('error while subtracting user bonus', error);
    return res.send(error).status(400);
  }
};

router.post('/subtract-user-bonus', validateRequest, subtractUserBonus);

module.exports = router;