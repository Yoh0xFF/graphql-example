import BaseService from './base.service';
import User from '../models/user.model';
import { compare, hash } from 'bcrypt';
import { UserInputError } from 'apollo-server-express';

const HASH_ROUNDS = 12;

class UserService extends BaseService {
    constructor() {
        super(User);
    }

    async login(email, password) {
        const user = await this.findByEmail(email);

        if (!user) {
            return;
        }

        if (!await compare(password, user.password)) {
            return;
        }

        delete user.password;

        return user;
    }

    async createUser(editUserReq) {
        editUserReq.password = await hash(editUserReq.password, HASH_ROUNDS);
        delete editUserReq.rePassword;

        editUserReq.role = editUserReq.role || 'USER';

        const user = await User.query().insert(editUserReq);

        return user;
    }

    async editUser(id, editUserReq) {
        if (!editUserReq.fullName) {
            delete editUserReq.fullName;
        }
        if (!editUserReq.email) {
            delete editUserReq.email;
        }

        if (editUserReq.email) {
            const user = await this.findByEmail(editUserReq.email);

            if (user && user.id !== id) {
                throw new UserInputError('Email address exists!');
            }
        }

        await User.query().findById(id).patch(editUserReq);

        return this.findById(id);
    }

    async deleteUser(id) {
        const user = await this.findById(id);

        await User.query().deleteById(id);

        return user;
    }

    async changePassword(id, password, newPassword) {
        const user = await this.findById(id);

        if (!await compare(password, user.password)) {
            return false;
        }

        newPassword = await hash(newPassword, HASH_ROUNDS);

        await User.query().findById(id).patch({
            password: newPassword
        });

        return true;
    }

    async findByEmail(email) {
        return User.query().findOne('email', email);
    }
}

export const userService = new UserService();
