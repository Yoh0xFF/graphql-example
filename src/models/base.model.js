import { Model, AjvValidator } from "objection";

const addFormats = require("ajv-formats").default;

export default class BaseModel extends Model {
  $beforeValidate(jsonSchema, json, opt) {
    Object.keys(jsonSchema.properties).forEach((prop) => {
      const propSchema = jsonSchema.properties[prop];

      if (propSchema.format && propSchema.format === "date") {
        json[prop] = json[prop] && json[prop].toISOString().split("T")[0];
      }
      if (propSchema.format && propSchema.format === "date-time") {
        json[prop] = json[prop] && json[prop].toISOString();
      }
    });

    return jsonSchema;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);

    const jsonSchema = this.constructor.jsonSchema;

    Object.keys(jsonSchema.properties).forEach((prop) => {
      const propSchema = jsonSchema.properties[prop];

      if (
        propSchema.format &&
        (propSchema.format === "date" || propSchema.format === "date-time")
      ) {
        json[prop] = json[prop] && new Date(json[prop]);
      }
    });

    return json;
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
        v5: true,
      },
    });
  }
}
