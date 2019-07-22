import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { initDatabase } from './utils/database';
import { apiExplorer } from './api';
import { verify } from './utils/jwt';
import { logger } from './utils/logging';
import depthLimit from 'graphql-depth-limit';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Do not reject self signed certificates
const port = process.env.PORT || 8080;

// Init database
initDatabase();

// Init api and run server
apiExplorer.getSchema()
    .then((schema) => {
        // Configure express
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(cors());

        // Configure apollo
        const apolloServer = new ApolloServer({
            schema,

            context: ({ req, res }) => {
                const context = {};

                // Verify jwt token
                const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
                const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
                context.authUser = token ? verify(token) : undefined;

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

        apolloServer.applyMiddleware({
            app
        });

        // Run server
        app.listen({
            port
        }, () => {
            logger.info(`🚀Server ready at http://localhost:${ port }${ apolloServer.graphqlPath }`);
        });
    })
    .catch(err => {
        logger.error('Failed to load api', err);
    });
