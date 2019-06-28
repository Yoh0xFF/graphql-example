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
            authorId: { type: 'integer' },
            fullName: { type: 'string', minLength: 1, maxLength: 255 },
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
            'authorId', 'fullName'
        ]
    };

    static relationMappings = {
        owner: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${ __dirname }/author.model`,
            join: {
                from: 'books.authorId',
                to: 'authors.id'
            }
        }
    };
}
