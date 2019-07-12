import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { homedir } from 'os';
import { initApi, initDatabase } from './utils/init';
import { verify } from './utils/jwt';
import { logger } from './utils/logging';
import depthLimit from 'graphql-depth-limit';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Do not reject self signed certificates
const port = process.env.PORT || 8080;
const dir = homedir();

// Init database
initDatabase();

// Init api and run server
initApi(`${ __dirname }/api`)
    .then((schema) => {
        // Configure express
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(cors());

        // Configure apollo
        const apollo = new ApolloServer({
            schema,

            context: ({ req }) => {
                const context = {};

                // Verify authorization token
                const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
                const token = parts.length === 2 ? parts[1] : parts[0];
                context.authUser = token ? verify(token) : {};

                return context;
            },

            formatError: (error) => {
                logger.error(error);
                return error;
            },

            validationRules: [
                depthLimit(5)
            ],

            debug: true
        });

        apollo.applyMiddleware({ app });

        // Run server
        app.listen({ port }, () => {
            logger.info(`🚀Server ready at http://localhost:${ port }${ apollo.graphqlPath }`);
        });
    })
    .catch(err => {
        logger.error('Failed to load api', err);
    });
