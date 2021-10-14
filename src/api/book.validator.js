import { UserInputError } from 'apollo-server-express';

export const validators = {

  Query: {

    books: (resolve, obj, args, context) => {
      const { first, offset } = args;

      if (first && !(first >= 1 && first <= 100)) {
        throw new UserInputError('You can query maximum 100 records!');
      }
      if (offset && offset < 1) {
        throw new UserInputError('Offset must be a positive integer!');
      }

      return resolve(obj, args, context);
    }
  }
};
