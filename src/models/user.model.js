import BaseModel from './base.model';

export default class User extends BaseModel {

    static tableName = 'users';

    static jsonSchema = {
        type: 'object',

        properties: {
            id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            fullName: { type: 'string', minLength: 1, maxLength: 255 },
            email: { type: 'string', minLength: 1, maxLength: 255, format: 'email' },
            password: { type: 'string', minLength: 1, maxLength: 255 }
        },

        required: [
            'fullName', 'email'
        ]
    };
}
