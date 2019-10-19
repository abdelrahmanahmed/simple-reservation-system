'use strict';

const express = require('express');
const debug = require('debug')('reservation:server');
const server = express();

const port = process.env.PORT;

server.listen(port, async () => {
  try {

    debug('trying to connect to database');
    await require('./app/config/db').getDb();
    const app = require('./app/app');

    server.use(app);

    debug('Server started at', port);
  } catch (error) {
    debug('Server Initialization failed: ', error);
    process.exit(1);
  }
});