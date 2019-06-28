import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { sign } from '../utils/jwt';

export const typeDefs = readFileSync(`${ __dirname }/auth.api.graphqls`, 'utf8');

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
                return { token: undefined, message: 'Invalid authentication credentials!' };
            }

            const token = sign(user.$toJson());

            return { token, message: 'Success!' };
        },

        signup: async (obj, { signupReq }, context, info) => {
            if (await userService.findByEmail(signupReq.email)) {
                return { user: undefined, message: 'Email address exists!' };
            }

            const user = await userService.createUser(signupReq);

            return { user, message: 'Success!' };
        },

        updatePersonalInfo: (obj, { fullName }, { authUser }, info) => {
            return userService.editUser(authUser.id, { fullName })
        },

        changePassword: async (obj, { password, newPassword, reNewPassword }, { authUser }, info) => {
            return await userService.changePassword(authUser.id, password, newPassword);
        },
    }
};
