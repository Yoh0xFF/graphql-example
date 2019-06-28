const os = require('os');
const dir = os.homedir();

module.exports = {
    development: {
        client: 'sqlite3',

        connection: {
            filename: `${ dir }/graphql.sqlite`
        },

        useNullAsDefault: true
    }
};
