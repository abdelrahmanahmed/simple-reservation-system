
exports.up = function (knex) {
    return knex.schema.createTable('room', function (t) {
        t.integer('id').primary();
        t.string('name', 255).notNullable();
        t.integer('available_amount').notNullable();
        t.bigInteger('required_points').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('room');

};
