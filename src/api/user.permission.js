import { isUserManager } from '../utils/shield';

export const permissions = {

  Query: {

    userById: isUserManager,

    users: isUserManager
  },

  Mutation: {

    editUser: isUserManager,

    deleteUser: isUserManager
  }
};
