'use strict';
const Router = require('express').Router;
const isAuthorized = require('./isAuthorized');
const subtractUserBonus = require('./subtractUserBonus');
const secertValidation = require('./middlwares/secertValidation');

const app = Router();

app.all('*', secertValidation);
app.use('/', isAuthorized);
app.use('/', subtractUserBonus);


module.exports = app;