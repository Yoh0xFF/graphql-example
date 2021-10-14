const os = require('os');
const dir = os.homedir();

module.exports = {
  development: {
    client: 'sqlite3',

    connection: {
      filename: `${ dir }/graphql.sqlite`
    },

    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON;', cb);
      }
    },

    useNullAsDefault: true
  }
};
