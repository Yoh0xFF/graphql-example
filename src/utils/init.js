import { knexSnakeCaseMappers, Model } from 'objection';
import { homedir } from 'os';
import fs from 'fs';
import path from 'path';
import Knex from 'knex';

export function initDatabase() {
    const dir = homedir();

    const databaseClient = Knex({
        client: 'sqlite3',

        connection: {
            filename: `${ dir }/graphql.sqlite`
        },

        pool: {
            afterCreate: (conn, cb) => {
                conn.run('PRAGMA foreign_keys = ON', cb);
            }
        },

        useNullAsDefault: true,

        ...knexSnakeCaseMappers()
    });

    Model.knex(databaseClient);
}

export async function initApi(directory) {
    const typeDefs = [], resolvers = [];
    const permissions = {}, validators = {};

    const _merge = (target, source) => {
        target.Query = target.Query ? target.Query : {};
        source.Query = source.Query ? source.Query : {};
        target.Mutation = target.Mutation ? target.Mutation : {};
        source.Mutation = source.Mutation ? source.Mutation : {};

        const preQuery = target.Query;
        const preMutation = target.Mutation;

        Object.assign(target, source);
        Object.assign(target.Query, preQuery);
        Object.assign(target.Mutation, preMutation);
    };

    const _scan = async (directory) => {
        const files = fs.readdirSync(directory)
            .filter(file => fs.lstatSync(path.join(directory, file)).isFile())
            .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

        const dirs = fs.readdirSync(directory)
            .filter(file => fs.lstatSync(path.join(directory, file)).isDirectory());

        for (const file of files) {
            const obj = await import(path.join(directory, file));

            if (obj.typeDefs) {
                typeDefs.push(obj.typeDefs);
            }
            if (obj.resolvers) {
                resolvers.push(obj.resolvers);
            }
            if (obj.permissions) {
                _merge(permissions, obj.permissions);
            }
            if (obj.validators) {
                _merge(validators, obj.validators);
            }
        }

        for (const dir of dirs) {
            await _scan(path.join(directory, file));
        }
    };

    await _scan(directory);

    return { typeDefs, resolvers, permissions, validators };
}
