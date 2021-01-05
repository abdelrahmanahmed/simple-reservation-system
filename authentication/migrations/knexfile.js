'use strict';

module.exports = {
 client: 'mysql2',
 debug: true,
 acquireConnectionTimeout:10000,
 connection: {
   host: 'localhost',
   port: '3312',
   user: 'root',
   password: 'root',
   database: 'user',
 },
 pool: {
   min: 1,
   max: 10,
   idleTimeoutMillis: 600000,
 },
 migrations: {
   directory: 'migrations',
   tableName: 'migrations',
 },
 seeds: {
   directory: 'seeds',
 },
};