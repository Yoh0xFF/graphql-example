import Author from '../models/author.model';
import BaseService from './base.service';

class AuthorService extends BaseService {

    constructor() {
        super(Author);
    }

    async createAuthor(creatorId, editAuthorReq) {
        editAuthorReq.creatorId = creatorId;

        const author = await Author.query().insert(editAuthorReq);

        return author;
    }

    async editAuthor(id, editAuthorReq) {
        await Author.query().findById(id).patch(editAuthorReq);

        return this.findById(id);
    }

    async deleteAuthor(id) {
        const author = await this.findById(id);

        await Author.Query().deleteById(id);

        return author;
    }

    async findAuthorsWithRecentBooks(authorIds) {
        return Author.query()
            .whereIn('id', authorIds)
            .eager('books')
            .modifyEager('books', builder => {
                builder.orderBy('createdAt', 'desc').limit(10);
            });
    }
}

export const authorService = new AuthorService();
