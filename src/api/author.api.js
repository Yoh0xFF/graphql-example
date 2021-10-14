import { readFileSync } from 'fs';
import { authorService } from '../services/author.service';
import { BookByAuthorDataLoader } from '../dataloaders/book.dataloader';
import { UserDataLoader } from '../dataloaders/user.dataloader';

export const typeDefs = readFileSync(`${ __dirname }/author.api.graphql`, 'utf8');

export const resolvers = {

  Query: {

    authorById: (obj, { id }, context, info) => {
      return authorService.findById(id);
    },

    authors: (obj, { first, offset }, context, info) => {
      return authorService.findAll(first, offset);
    }
  },

  Mutation: {

    createAuthor: (obj, { editAuthorReq }, { authUser }, info) => {
      return authorService.createAuthor(authUser.id, editAuthorReq);
    },

    editAuthor: (obj, { id, editAuthorReq }, context, info) => {
      return authorService.editAuthor(id, editAuthorReq);
    },

    deleteAuthor: (obj, { id }, context, info) => {
      return authorService.deleteAuthor(id);
    }
  },

  Author: {

    creator: ({ creatorId }, args, context, info) => {
      const userDataLoader = UserDataLoader.getInstance(context);

      return userDataLoader.load(creatorId);
    },

    books: ({ id }, args, context, info) => {
      const bookByAuthorDataLoader = BookByAuthorDataLoader.getInstance(context);

      return bookByAuthorDataLoader.load(id);
    }
  }
};
