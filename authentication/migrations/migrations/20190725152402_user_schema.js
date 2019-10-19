
exports.up = function (knex) {
    return knex.schema.createTable('user', function (t) {
        t.integer('id').primary();
        t.string('name', 255).notNullable();
        t.string('role', 255).notNullable();
        t.bigInteger('bonus').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user');

};
