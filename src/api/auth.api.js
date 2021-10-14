import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { sign } from '../utils/jwt';

export const typeDefs = readFileSync(`${ __dirname }/auth.api.graphql`, 'utf8');

export const resolvers = {

  Query: {

    authUser: (obj, args, { authUser }, info) => {
      return userService.findById(authUser.id);
    }
  },

  Mutation: {

    login: async (obj, { email, password }, context, info) => {
      const user = await userService.login(email, password);

      if (!user) {
        return {
          success: false, message: 'Invalid authentication credentials!', token: undefined
        };
      }

      const token = sign(user.$toJson());

      return {
        success: true, message: 'Success!', token
      };
    },

    signup: async (obj, { signupReq }, context, info) => {
      if (await userService.findByEmail(signupReq.email)) {
        return {
          success: false, message: 'Email address exists!', user: undefined
        };
      }

      const user = await userService.createUser(signupReq);

      return {
        success: true, message: 'Success!', user
      };
    },

    updatePersonalInfo: (obj, { fullName }, { authUser }, info) => {
      return userService.editUser(authUser.id, {
        fullName
      });
    },

    changePassword: (obj, { password, newPassword, reNewPassword }, { authUser }, info) => {
      return userService.changePassword(authUser.id, password, newPassword);
    }
  }
};
