import DataLoader from 'dataloader';
import { authorService } from '../services/author.service';

export class BookByAuthorDataLoader extends DataLoader {
    constructor() {
        const batchLoader = authorIds => {
            return authorService
                .findAuthorsWithRecentBooks(authorIds)
                .then(
                    authors => authorIds.map(
                        authorId => authors.filter(author => author.id === authorId)[0].books
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
