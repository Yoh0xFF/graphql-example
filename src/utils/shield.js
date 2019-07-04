import { rule } from 'graphql-shield';

export const isAuthorized = rule()(
    (parent, args, { authUser }, info) => authUser && authUser.id > 0
);
