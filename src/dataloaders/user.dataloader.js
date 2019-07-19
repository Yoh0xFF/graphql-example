import DataLoader from 'dataloader';
import User from '../models/user.model';

export class UserDataLoader extends DataLoader {

    constructor() {
        const batchLoader = async userIds => {
            return User.query().whereIn('id', userIds);
        };

        super(batchLoader);
    }

    static getInstance(context) {
        if (!context.userDataLoader) {
            context.userDataLoader = new UserDataLoader();
        }

        return context.userDataLoader;
    }
}
