import { allow } from 'graphql-shield';

export const permissions = {

  Query: {

    authorById: allow,

    authors: allow
  }
};
