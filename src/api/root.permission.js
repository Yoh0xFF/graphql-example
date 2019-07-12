import { allow } from 'graphql-shield';
import { isAuthorized } from '../utils/shield';

export const permissions = {

    Query: {

        '*': isAuthorized,
        ping: allow
    },

    Mutation: {

        '*': isAuthorized,
        ping: allow
    }
};
