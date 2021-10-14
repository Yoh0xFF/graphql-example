const tableName = 'author_books';

exports.up = (knex, Promise) => {
  return knex
    .schema
    .createTable(tableName, (t) => {
      t.integer('author_id').unsigned().notNullable();
      t.integer('book_id').unsigned().notNullable();

      t.foreign('author_id', 'author_books_fk1').references('authors.id');
      t.foreign('book_id', 'author_books_fk1').references('books.id');
    });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
