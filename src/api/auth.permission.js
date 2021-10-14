import { allow } from 'graphql-shield';

export const permissions = {

  Mutation: {

    login: allow,

    signup: allow
  }
};
