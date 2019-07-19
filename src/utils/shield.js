import { rule } from 'graphql-shield';

export const isAuthorized = rule()(
    (obj, args, { authUser }, info) => authUser && true
);

export const isUserManager = rule()(
    (obj, args, { authUser }, info) => authUser && authUser.role === 'USER_MANAGER'
);
