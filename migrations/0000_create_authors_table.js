const tableName = 'authors';

exports.up = (knex, Promise) => {
    return knex
        .schema
        .createTable(tableName, function (t) {
            t.increments('id').unsigned().notNullable().primary();
            t.dateTime('created_at').notNullable();
            t.dateTime('updated_at').notNullable();
            t.string('full_name').notNullable();
            t.text('about');
            t.string('nationality');
            t.string('genre');
        });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable(tableName);
};
