import { apiExplorer } from '../../src/api';
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';

export async function initApolloTestClient(context) {
  const schema = await apiExplorer.getSchema();

  const apolloServer = new ApolloServer({
    schema, context
  });

  return createTestClient(apolloServer);
}
