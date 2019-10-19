'use strict';
const Router = require('express').Router;

const tokenValidation = require('./middlwares/tokenValidation');//to be moved to API GATWAY
const authorization = require('./middlwares/authorization');

const availableRooms = require('./routes/availableRooms');
const reserveRoom = require('./routes/reserveRoom');
const app = Router();

app.all('*', tokenValidation);
app.all('*', authorization);

app.use('/', availableRooms);
app.use('/', reserveRoom);

module.exports = app;