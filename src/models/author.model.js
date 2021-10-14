import BaseModel from './base.model';
import { Model } from 'objection';

export default class Author extends BaseModel {

  static tableName = 'authors';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      creatorId: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      fullName: { type: 'string', minLength: 1, maxLength: 255 },
      about: { type: 'string', minLength: 1, maxLength: 4000 },
      nationality: { type: 'string', minLength: 1, maxLength: 255 },
      genre: { type: 'string', minLength: 1, maxLength: 255 }
    },

    required: [
      'creatorId', 'fullName'
    ]
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${ __dirname }/user.model`,
      join: {
        from: 'authors.creatorId',
        to: 'users.id'
      }
    },

    books: {
      relation: Model.ManyToManyRelation,
      modelClass: `${ __dirname }/book.model`,
      join: {
        from: 'authors.id',
        to: 'books.id',
        through: {
          from: 'author_books.authorId',
          to: 'author_books.bookId'
        }
      }
    }
  };

}
