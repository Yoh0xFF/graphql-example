const tableName = 'authors';

exports.up = (knex, Promise) => {
  return knex
    .schema
    .createTable(tableName, (t) => {
      t.increments('id').unsigned().notNullable().primary();
      t.integer('creator_id').unsigned().notNullable();
      t.dateTime('created_at').notNullable();
      t.dateTime('updated_at').notNullable();
      t.string('full_name').notNullable();
      t.text('about');
      t.string('nationality');
      t.string('genre');

      t.foreign('creator_id', 'authors_fk1').references('users.id');
    });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
