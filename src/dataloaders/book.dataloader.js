import Book from '../models/book.model';
import Author from '../models/author.model';
import DataLoader from 'dataloader';

export class BookDataLoader extends DataLoader {

    constructor() {
        const batchLoader = async bookIds => {
            return Book.query().whereIn('id', bookIds);
        };

        super(batchLoader);
    }

    static getInstance(context) {
        if (!context.bookDataLoader) {
            context.bookDataLoader = new BookDataLoader();
        }

        return context.bookDataLoader;
    }
}

export class BookByAuthorDataLoader extends DataLoader {

    constructor() {
        const batchLoader = async authorIds => {
            return Author.query()
                .whereIn('id', authorIds)
                .eager('books')
                .then(authors =>
                    authors.reduce((books, author) => {
                        books.push(author.books);
                        return books;
                    }, [])
                );
        };

        super(batchLoader);
    }

    static getInstance(context) {
        if (!context.bookByAuthorDataLoader) {
            context.bookByAuthorDataLoader = new BookByAuthorDataLoader();
        }

        return context.bookByAuthorDataLoader;
    }
}
