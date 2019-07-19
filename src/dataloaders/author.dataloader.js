import DataLoader from 'dataloader';
import { bookService } from '../services/book.service';

export class AuthorByBookDataLoader extends DataLoader {

    constructor() {
        const batchLoader = bookIds => {
            return bookService
                .findBooksWithAuthors(bookIds)
                .then(
                    books => bookIds.map(
                        bookId => books.filter(book => book.id === bookId)[0].authors
                    )
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
