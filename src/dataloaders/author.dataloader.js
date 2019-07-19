import DataLoader from 'dataloader';
import Author from '../models/author.model';
import Book from '../models/book.model';

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

export class AuthorByBookDataLoader extends DataLoader {

    constructor() {
        const batchLoader = async bookIds => {
            return Book.query()
                .whereIn('id', bookIds)
                .eager('authors')
                .then(books =>
                    books.reduce((authors, book) => {
                        authors.push(book.authors);
                        return authors;
                    }, [])
                );
        };

        super(batchLoader);
    }

    static getInstance(context) {
        if (!context.authorByBookDataLoader) {
            context.authorByBookDataLoader = new AuthorByBookDataLoader();
        }

        return context.authorByBookDataLoader;
    }
}
