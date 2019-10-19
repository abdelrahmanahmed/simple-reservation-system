'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express.Router();
const { isAlive } = require('./health-check/liveness');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/isAlive', isAlive);
app.use('/', require('./routes'));

app.use((err, req, res, next) => {
  res.status(500).end(JSON.stringify(err));
  return next();
});

module.exports = app;