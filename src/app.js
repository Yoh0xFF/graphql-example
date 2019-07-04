import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { homedir } from 'os';
import { initApi, initDatabase } from './utils/init';
import { verify } from './utils/jwt';
import { shield } from 'graphql-shield';
import { isAuthorized } from './utils/shield';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Do not reject self signed certificates
const port = process.env.PORT || 8080;
const dir = homedir();

// Init database
initDatabase();

// Init api and run server
initApi(`${ __dirname }/api`)
    .then(({ typeDefs, resolvers, permissions, validators }) => {
        // Configure express
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(cors());

        // Create graphql schema with middleware
        const schema = makeExecutableSchema({ typeDefs, resolvers });
        const schemaWithMiddleware = applyMiddleware(schema, validators, shield(permissions));

        // Configure apollo
        const apollo = new ApolloServer({
            schema: schemaWithMiddleware,

            context: ({ req }) => {
                const context = {};

                // Verify authorization token
                const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
                const token = parts.length === 2 ? parts[1] : parts[0];
                context.authUser = token ? verify(token) : {};

                return context;
            },

            formatError: (error) => {
                console.error(error);
                return error;
            },

            debug: true
        });

        apollo.applyMiddleware({ app });

        // Run server
        app.listen({ port }, () => {
            console.log(`🚀Server ready at http://localhost:${ port }${ apollo.graphqlPath }`);
        });
    })
    .catch(err => {
        console.log(`Failed to load api - ${ err }`);
    });
