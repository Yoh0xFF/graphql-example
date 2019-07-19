import BaseModel from './base.model';
import { Model } from 'objection';

export default class Book extends BaseModel {

    static tableName = 'books';

    static jsonSchema = {
        type: 'object',

        properties: {
            id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            about: { type: 'string', minLength: 1, maxLength: 4000 },
            language: { type: 'string', minLength: 1, maxLength: 255 },
            genre: { type: 'string', minLength: 1, maxLength: 255 },
            isbn13: { type: 'string', minLength: 1, maxLength: 255 },
            isbn10: { type: 'string', minLength: 1, maxLength: 255 },
            publisher: { type: 'string', minLength: 1, maxLength: 255 },
            publishDate: { type: 'string', format: 'date' },
            hardcover: { type: 'integer' }
        },

        required: [
            'title'
        ]
    };

    static relationMappings = {
        authors: {
            relation: Model.ManyToManyRelation,
            modelClass: `${ __dirname }/author.model`,
            join: {
                from: 'books.id',
                to: 'authors.id',
                through: {
                    from: 'author_books.bookId',
                    to: 'author_books.authorId'
                }
            }
        }
    };
}
