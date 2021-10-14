import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    bookById: allow,

    booksByAuthor: allow,

    books: allow
  }
};
