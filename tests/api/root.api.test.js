import { initApolloTestClient } from '../utils/apollo-test-client';
import { SAY_HELLO_MUTATION, SAY_HELLO_QUERY } from './root.api.test.gql';
import { describe, expect, test } from '@jest/globals';

describe('Test root api', () => {
  test('Test root query', async () => {
    const { query } = await initApolloTestClient();

    const { data } = await query({
      query: SAY_HELLO_QUERY
    });

    expect(data).toEqual({
      sayHello: 'Hello User!'
    });
  });

  test('Test root mutation', async () => {
    const { mutate } = await initApolloTestClient();

    const { data } = await mutate({
      mutation: SAY_HELLO_MUTATION
    });

    expect(data).toEqual({
      sayHello: 'Hello User!'
    });
  });
});
