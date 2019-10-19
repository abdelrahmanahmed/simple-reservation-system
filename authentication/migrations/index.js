'use strict';
let knexConfig = require('./knexfiletemp');
let knex = require('knex')(knexConfig);
const command = process.argv.slice(2)[0];

Promise.resolve()
    .then(() => {
        console.log("CREATE DATABASE");
        return knex.raw('CREATE DATABASE IF NOT EXISTS user')
    })
    .then(function () {
        console.log("DATABASE CREATED");
        knex.destroy();
        knexConfig.connection.database = 'user';
        knex = require('knex')(knexConfig);
       
    })
    .then(() => {
        if (command === 'migrate' || command === 'm') {
            console.log("run migration")
            return knex.migrate.latest();
        }
        else if (command === 'rollback' || command === 'r') {
            console.log("run rollback")
            return knex.migrate.rollback();
        }
        console.log("missing run paramter");
        process.exit(1);
    }).then((results) => {
        if (results[1].length)
            console.log("Migration Done");
        else {
            console.log("Already up to date");
        }
        process.exit(0);
    }).catch((error) => {
        console.log("Server error", error);
        return process.exit(1);
    });

