import BaseService from './base.service';
import Book from '../models/book.model';
import { transaction } from 'objection';

class BookService extends BaseService {

    constructor() {
        super(Book);
    }

    async createBook(creatorId, editBookReq) {
        const { authorIds } = editBookReq;

        editBookReq.creatorId = creatorId;
        delete editBookReq.authorIds;

        let trx;
        try {
            trx = await transaction.start(Book.knex());

            const book = await Book.query(trx).insert(editBookReq);

            for (const authorId of authorIds) {
                await book.$relatedQuery('authors', trx).relate(authorId);
            }

            await trx.commit();

            return book;
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async editBook(id, editBookReq) {
        const { authorIds } = editBookReq;
        delete editBookReq.authorIds;

        let trx;
        try {
            trx = await transaction.start(Book.knex());

            await Book.query(trx).findById(id).patch(editBookReq);
            const book = await Book.query(trx).findById(id);

            await book.$relatedQuery('authors', trx).unrelate();
            for (const authorId of authorIds) {
                await book.$relatedQuery('authors', trx).relate(authorId);
            }

            await trx.commit();

            return book;
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async deleteBook(id) {
        const book = await this.findById(id);

        await Book.Query().deleteById(id);

        return book;
    }

    async findByAuthor(authorId) {
        return Book.query().where('authorId', authorId);
    }

    async findBooksWithAuthors(bookIds) {
        return Book.query()
            .whereIn('id', bookIds)
            .eager('authors');
    }
}

export const bookService = new BookService();
