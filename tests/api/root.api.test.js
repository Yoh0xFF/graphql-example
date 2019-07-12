import { apiExplorer } from '../../src/utils/init.api'
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

const PING = gql`
    query {
        ping
    }
`;

describe('Test', () => {

    it('Test 1', async () => {
        const schema = await apiExplorer.getSchema(`${ __dirname }/../../src/api`);

        const apollo = new ApolloServer({
            schema
        });

        const { query } = createTestClient(apollo);

        const res = await query({ query: PING });
        expect(res).toMatchSnapshot();
    });

    it('Test 2', async () => {
        const schema = await apiExplorer.getSchema(`${ __dirname }/../../src/api`);

        const apollo = new ApolloServer({
            schema
        });

        const { query } = createTestClient(apollo);

        const res = await query({ query: PING });
        expect(res).toMatchSnapshot();
    });
});


