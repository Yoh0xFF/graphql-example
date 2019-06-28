import Book from '../models/book.model';
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
            return Book.query()
                .whereIn('authorId', authorIds)
                .then(books =>
                    authorIds.map(authorId =>
                        books.filter(book =>
                            book.authorId === authorId
                        )
                    )
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
