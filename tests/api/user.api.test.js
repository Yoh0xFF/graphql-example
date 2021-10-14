import { initApolloTestClient } from '../utils/apollo-test-client';
import { userService } from '../../src/services/user.service';
import { DEL_USER_MUTATION, EDIT_USER_MUTATION, USER_BY_ID_QUERY, USERS_QUERY } from './user.api.test.gql';
import { closeDatabase, initDatabase } from '../../src/utils/database';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Test user api', () => {
  beforeAll(async () => {
    initDatabase();
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    closeDatabase().finally(done);
  });

  test('Test editUser mutation fail, email exists', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;
    const newFullName = 'Test user 123';
    const newEmail = 'admin@mail.com';

    const { mutate } = await initApolloTestClient({
      authUser: admin
    });
    const { data, errors } = await mutate({
      mutation: EDIT_USER_MUTATION,
      variables: {
        id, fullName: newFullName, email: newEmail
      }
    });
    expect(data.editUser).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test editUser mutation fail, id not found', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;
    const newFullName = 'Test user 123';
    const newEmail = `user_${ Date.now() }@mail.com`;
    await userService.deleteUser(id);

    const { mutate } = await initApolloTestClient({
      authUser: admin
    });
    const { data, errors } = await mutate({
      mutation: EDIT_USER_MUTATION,
      variables: {
        id, fullName: newFullName, email: newEmail
      }
    });
    expect(data.editUser).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test editUser mutation success', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;
    const newFullName = 'Test user 123';
    const newEmail = `user_${ Date.now() }@mail.com`;

    const { mutate } = await initApolloTestClient({
      authUser: admin
    });
    const { data } = await mutate({
      mutation: EDIT_USER_MUTATION,
      variables: {
        id, fullName: newFullName, email: newEmail
      }
    });
    expect(data.editUser).toBeTruthy();
    expect(data.editUser.fullName).toBe(newFullName);
    expect(data.editUser.email).toBe(newEmail);
  });

  test('Test deleteUser mutation fail, id not found', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;
    await userService.deleteUser(id);

    const { mutate } = await initApolloTestClient({
      authUser: admin
    });
    const { data, errors } = await mutate({
      mutation: DEL_USER_MUTATION,
      variables: {
        id
      }
    });
    expect(data.deleteUser).not.toBeTruthy();
    expect(errors).not.toBeTruthy();
  });

  test('Test deleteUser mutation success', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;

    const { mutate } = await initApolloTestClient({
      authUser: admin
    });
    const { data } = await mutate({
      mutation: DEL_USER_MUTATION,
      variables: {
        id
      }
    });
    expect(data.deleteUser).toBeTruthy();
    expect(data.deleteUser.id).toBe('' + id);
  });

  test('Test userById query fail, id not found', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });
    const { id } = user;
    await userService.deleteUser(id);

    const { query } = await initApolloTestClient({
      authUser: admin
    });
    const { data } = await query({
      query: USER_BY_ID_QUERY,
      variables: {
        id
      }
    });
    expect(data.userById).not.toBeTruthy();
  });

  test('Test userById query success', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const { query } = await initApolloTestClient({
      authUser: admin
    });
    const { data } = await query({
      query: USER_BY_ID_QUERY,
      variables: {
        id: 1
      }
    });
    expect(data.userById).toBeTruthy();
    expect(data.userById.id).toBe('1');
  });

  test('Test users query success', async () => {
    const admin = await userService.findByEmail('admin@mail.com');

    const { query } = await initApolloTestClient({
      authUser: admin
    });
    const { data } = await query({
      query: USERS_QUERY
    });
    expect(data.users).toBeTruthy();
    expect(Array.isArray(data.users)).toBeTruthy();
  });
});
