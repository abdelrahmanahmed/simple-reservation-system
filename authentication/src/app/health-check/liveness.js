'use strict';
const debug = require('debug')('authentication:app:health-check');

const isAlive = (req, res, next) => {
  debug('Is Alive!');
  return res.status(200).send({ response: 'OK' });
};

module.exports = {
  isAlive,
};