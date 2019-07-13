import { knexSnakeCaseMappers, Model } from 'objection';
import { homedir } from 'os';
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
