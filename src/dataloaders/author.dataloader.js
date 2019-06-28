import DataLoader from 'dataloader';
import Author from '../models/author.model';

export default class AuthorDataLoader extends DataLoader {

    constructor() {
        const batchLoader = async authorIds => {
            return Author.query().whereIn('id', authorIds);
        };

        super(batchLoader);
    }

    static getInstance(context) {
        if (!context.authorDataLoader) {
            context.authorDataLoader = new AuthorDataLoader();
        }

        return context.authorDataLoader;
    }
}
