'use strict';

const { users } = require('../setup-data');

exports.seed = (knex) => {
  return knex('user').insert(users)
};
