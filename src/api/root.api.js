import { readFileSync } from 'fs';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export const typeDefs = readFileSync(`${ __dirname }/root.api.graphqls`, 'utf8');

export const resolvers = {

    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,

    Query: {
        ping: () => {
            return 'Hello!';
        }
    },

    Mutation: {
        ping: () => {
            return 'Hello!';
        }
    }
};
