import { Model } from 'objection';

export default class BaseModel extends Model {

    $beforeValidate(jsonSchema, json, opt) {
        Object.keys(jsonSchema.properties).forEach(prop => {
            const propSchema = jsonSchema.properties[prop];

            if (propSchema.format && propSchema.format === 'date') {
                json[prop] = json[prop] && json[prop].toISOString().split('T')[0];
            }
            if (propSchema.format && propSchema.format === 'date-time') {
                json[prop] = json[prop] && json[prop].toISOString();
            }
        });

        return jsonSchema;
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date().toISOString();
    }

    $parseDatabaseJson(json) {
        json = super.$parseDatabaseJson(json);

        const jsonSchema = this.constructor.jsonSchema;

        Object.keys(jsonSchema.properties).forEach(prop => {
            const propSchema = jsonSchema.properties[prop];

            if (propSchema.format && (propSchema.format === 'date' || propSchema.format === 'date-time')) {
                json[prop] = json[prop] && new Date(json[prop]);
            }
        });

        return json;
    }
}
