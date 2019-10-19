'use strict';

const knex = require('knex');
const debug = require('debug')('reservation:app:config:db');

let db;

const getDb = () => {
    if (db) {
        debug('RETURNING CACHED DB CONNECTION OBJECT');
        return db;
    }
    debug('CREATING FRESH DB CONNECTION OBJECT');
    db = knex({
        client: 'mysql2',
        debug: false,
        acquireConnectionTimeout: 10000,
        connection: {
            host: 'db',
            port: '3306',
            user: 'root',
            password: 'root',
            database: 'reservation',
        },
        pool: {
            min: 1,
            max: 10,
            idleTimeoutMillis: 600000,
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
