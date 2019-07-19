import { readFileSync } from 'fs';
import { bookService } from '../services/book.service';
import { AuthorByBookDataLoader } from '../dataloaders/author.dataloader';
import { UserDataLoader } from '../dataloaders/user.dataloader';

export const typeDefs = readFileSync(`${ __dirname }/book.api.graphqls`, 'utf8');

export const resolvers = {

    Query: {

        bookById: (obj, { id }, context, info) => {
            return bookService.findById(id);
        },

        booksByAuthor: (obj, { authorId }, context, info) => {
            return bookService.findByAuthor(authorId);
        },

        books: (obj, args, context, info) => {
            return bookService.findAll();
        }
    },

    Mutation: {

        createBook: (obj, { editBookReq }, { authUser }, info) => {
            return bookService.createBook(authUser.id, editBookReq);
        },

        editBook: (obj, { id, editBookReq }, context, info) => {
            return bookService.editBook(id, editBookReq);
        },

        deleteBook: (obj, { id }, context, info) => {
            return bookService.deleteBook(id);
        }
    },

    Book: {

        creator: ({ creatorId }, args, context, info) => {
            const userDataLoader = UserDataLoader.getInstance(context);

            return userDataLoader.load(creatorId);
        },

        authors: ({ id }, args, context, info) => {
            const authorByBookDataLoader = AuthorByBookDataLoader.getInstance(context);

            return authorByBookDataLoader.load(id);
        }
    }
};

