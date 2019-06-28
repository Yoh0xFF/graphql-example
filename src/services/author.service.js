import Author from '../models/author.model';
import BaseService from './base.service';

class AuthorService extends BaseService {

    constructor() {
        super(Author);
    }

    async createAuthor(editAuthorReq) {
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
}

export const authorService = new AuthorService();
