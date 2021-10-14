import { closeDatabase, initDatabase } from '../../src/utils/database';
import { userService } from '../../src/services/user.service';
import { initApolloTestClient } from '../utils/apollo-test-client';
import { authorService } from '../../src/services/author.service';
import { bookService } from '../../src/services/book.service';
import {
  BOOK_BY_ID_QUERY,
  BOOKS_QUERY,
  CREATE_BOOK_MUTATION,
  DEL_BOOK_MUTATION,
  EDIT_BOOK_MUTATION
} from './book.api.test.gql';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Test book api', () => {
  const authors = [];
  const authorIds = [];

  beforeAll(async () => {
    initDatabase();

    const user = await userService.findByEmail('user@mail.com');

    const author1 = await authorService.createAuthor(user.id, {
      fullName: 'Test author 1'
    });
    const author2 = await authorService.createAuthor(user.id, {
      fullName: 'Test author 2'
    });
    const author3 = await authorService.createAuthor(user.id, {
      fullName: 'Test author 3'
    });
    authors.push(author1);
    authors.push(author2);
    authors.push(author3);
    authorIds.push(author1.id);
    authorIds.push(author2.id);
    authorIds.push(author3.id);
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    closeDatabase().finally(done);
  });

  test('Test createBook mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await mutate({
      mutation: CREATE_BOOK_MUTATION,
      variables: {
        authorIds, title, about
      }
    });
    expect(data.createBook).toBeTruthy();
    expect(data.createBook.creator.id).toBe('' + user.id);
    expect(data.createBook.authors.length).toBe(authorIds.length);
    expect(data.createBook.title).toBe(title);
    expect(data.createBook.about).toBe(about);
  });

  test('Test editBook mutation fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;
    await bookService.deleteBook(id);

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await mutate({
      mutation: EDIT_BOOK_MUTATION,
      variables: {
        id, authorIds, title, about
      }
    });
    expect(data.editBook).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test editBook mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;
    const newAuthorIds = [authorIds[0]];
    const newTitle = 'Test book new';
    const newAbout = 'Test about new';

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await mutate({
      mutation: EDIT_BOOK_MUTATION,
      variables: {
        id, authorIds: newAuthorIds, title: newTitle, about: newAbout
      }
    });
    expect(data.editBook).toBeTruthy();
    expect(data.editBook.authors.length).toBe(newAuthorIds.length);
    expect(data.editBook.authors[0].id).toBe('' + newAuthorIds[0]);
    expect(data.editBook.title).toBe(newTitle);
    expect(data.editBook.about).toBe(newAbout);
  });

  test('Test deleteBook mutation fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;
    await bookService.deleteBook(id);

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await mutate({
      mutation: DEL_BOOK_MUTATION,
      variables: {
        id
      }
    });
    expect(data.deleteBook).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test deleteBook mutation success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await mutate({
      mutation: DEL_BOOK_MUTATION,
      variables: {
        id
      }
    });
    expect(data.deleteBook).toBeTruthy();
    expect(data.deleteBook.title).toBe(title);
    expect(data.deleteBook.about).toBe(about);
  });

  test('Test bookById query fail, id not found', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;
    await bookService.deleteBook(id);

    const { query } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await query({
      query: BOOK_BY_ID_QUERY,
      variables: {
        id
      }
    });
    expect(data.bookById).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test bookById query success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    const book = await bookService.createBook(user.id, {
      authorIds, title, about
    });
    const { id } = book;

    const { query } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await query({
      query: BOOK_BY_ID_QUERY,
      variables: {
        id
      }
    });
    expect(data.bookById).toBeTruthy();
    expect(data.bookById.title).toBe(title);
    expect(data.bookById.about).toBe(about);
  });

  test('Test books query fail, limit exceeded', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    await bookService.createBook(user.id, {
      authorIds, title, about
    });

    const { query } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await query({
      query: BOOKS_QUERY,
      variables: {
        first: 101, offset: 1
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test books query success', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const title = 'Test book';
    const about = 'Test about';
    await bookService.createBook(user.id, {
      authorIds, title, about
    });

    const { query } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await query({
      query: BOOKS_QUERY
    });
    expect(data.books).toBeTruthy();
    expect(Array.isArray(data.books)).toBeTruthy();
  });
});
