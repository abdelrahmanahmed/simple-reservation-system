'use strict';

const { rooms } = require('../setup-data');

exports.seed = (knex) => {
  return knex('room').insert(rooms);

};
