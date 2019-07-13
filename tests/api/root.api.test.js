import gql from 'graphql-tag';
import { initApolloClient } from '../utils/apollo-client';
import { PING_MUTATION, PING_QUERY } from './root.api.test.gql';

describe('Test root api', () => {

    test('Test root query', async () => {
        const { query } = await initApolloClient();

        const { data } = await query({ query: PING_QUERY });

        expect(data).toEqual({ 'ping': 'Hello!' });
    });

    test('Test root mutation', async () => {
        const { mutate } = await initApolloClient();

        const { data } = await mutate({ mutation: PING_MUTATION });

        expect(data).toEqual({ 'ping': 'Hello!' });
    });
});
