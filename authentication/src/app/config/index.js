'use strict';

const app = require('./app');
const userAccess = require('./user-access');
const db = require('./db');

module.exports = {
  app,
  userAccess,
  db
};
