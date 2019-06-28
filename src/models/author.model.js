import BaseModel from './base.model';
import { Model } from 'objection';

export default class Author extends BaseModel {

    static tableName = 'authors';

    static jsonSchema = {
        type: 'object',

        properties: {
            id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            fullName: { type: 'string', minLength: 1, maxLength: 255 },
            about: { type: 'string', minLength: 1, maxLength: 4000 },
            nationality: { type: 'string', minLength: 1, maxLength: 255 },
            genre: { type: 'string', minLength: 1, maxLength: 255 }
        },

        required: [
            'fullName'
        ]
    };

    static relationMappings = {
        relation: Model.HasManyRelation,
        modelClass: `${ __dirname }/book.model`,
        join: {
            from: 'authors.id',
            to: 'books.authorId'
        }
    };
}
