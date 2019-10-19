'use strict';

const knex = require('knex');
const debug = require('debug')('reservation:app:config:db');

let db;

function getDb() {
    if (db) {
        debug('returning cached db connection object');
        return db;
    }
    debug('creating fresh db connection object');
    db = knex({
        client: 'mysql2',
        debug: false,
        acquireConnectionTimeout: 10000,
        connection: {
            host: 'usersdb',
            port: '3306',
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
    });
    return db;
}

const roomStatus = {
    reserved: 1,
    pending_approval: 2
}

module.exports = {
    getDb,
    roomStatus
};
