const express = require('express');
const debug = require('debug')('authentication:server');
const server = express();

const port = process.env.PORT;
server.listen(port, () => {
  const app = require('./app/app');
  server.use(app);
  debug('Server started at', port);
});