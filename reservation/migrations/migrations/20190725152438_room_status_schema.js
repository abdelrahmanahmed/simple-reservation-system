
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('room_status', function (t) {
            t.integer('id').primary();
            t.string('status', 50).notNullable();
        })
    ]).then(() => {
        return knex('room_status').insert([
            { id: 1, status: 'RESERVED' },
            { id: 2, status: 'PENDING_APPROVAL' }
        ])
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('room_status')
};
