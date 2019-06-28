import BaseService from './base.service';
import Book from '../models/book.model';

class BookService extends BaseService {

    constructor() {
        super(Book);
    }

    async createBook(editBookReq) {
        const book = await Book.query().insert(editBookReq);

        return book;
    }

    async editBook(id, editBookReq) {
        await Book.query().findById(id).patch(editBookReq);

        return this.findById(id);
    }

    async deleteBook(id) {
        const book = await this.findById(id);

        await Book.Query().deleteById(id);

        return book;
    }

    async findByAuthor(authorId) {
        return Book.query().where('authorId', authorId);
    }
}

export const bookService = new BookService();
