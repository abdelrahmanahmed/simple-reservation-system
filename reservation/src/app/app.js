'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express.Router();

const { isAlive } = require('./health-check/liveness');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/isAlive', isAlive);
app.use('/api', require('./api'));

module.exports = app;