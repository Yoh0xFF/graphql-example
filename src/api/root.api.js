import { readFileSync } from 'fs';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export const typeDefs = readFileSync(`${ __dirname }/root.api.graphql`, 'utf8');

export const resolvers = {

  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,

  Query: {

    sayHello: (obj, args, context, info) => {
      return `Hello ${ args.name }!`;
    }
  },

  Mutation: {

    sayHello: (obj, args, context, info) => {
      return `Hello ${ args.name }!`;
    }
  }
};
