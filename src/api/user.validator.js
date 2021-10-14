import { UserInputError } from 'apollo-server-express';
import { isEmail } from 'validator';

export const validators = {

  Mutation: {

    editUser: (resolve, obj, args, context) => {
      const { email } = args.editUserReq;

      if (!isEmail(email)) {
        throw new UserInputError('Invalid Email address!');
      }

      return resolve(obj, args, context);
    }
  }
};
