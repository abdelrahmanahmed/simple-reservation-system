
exports.up = function (knex) {
    return knex.schema.createTable('reservation', function (t) {
        t.increments('id').primary().increamtal;
        t.integer('user_id').notNullable();
        t.integer('room_id').references('id').inTable('room').notNullable();
        t.integer('room_status').references('id').inTable('room_status').notNullable();
        t.specificType('created_at', 'timestamp(3)').defaultTo(knex.fn.now(3));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reservation')
};
