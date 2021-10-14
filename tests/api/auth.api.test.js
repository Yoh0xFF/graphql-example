import { initApolloTestClient } from '../utils/apollo-test-client';
import { initDatabase, closeDatabase } from '../../src/utils/database';
import { userService } from '../../src/services/user.service';
import {
  AUTH_USER_QUERY,
  CHANGE_PASSWORD_MUTATION,
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_PERSONAL_INFO_MUTATION
} from './auth.api.test.gql';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Test auth api', () => {
  beforeAll(async () => {
    initDatabase();
  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    closeDatabase().finally(done);
  });

  test('Test authUser query not authorized', async () => {
    const { query } = await initApolloTestClient();

    const { data, errors } = await query({
      query: AUTH_USER_QUERY
    });
    expect(data.authUser).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('FORBIDDEN');
  });

  test('Test authUser query authorized', async () => {
    const user = await userService.findByEmail('user@mail.com');

    const { query } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await query({
      query: AUTH_USER_QUERY
    });
    expect(data.authUser).toBeTruthy();
    expect(data.authUser.id).toBe('' + user.id);
    expect(data.authUser.email).toBe(user.email);
  });

  test('Test login mutation fail', async () => {
    const { mutate } = await initApolloTestClient();

    const { data } = await mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: 'user@mail.com',
        password: '123'
      }
    });
    expect(data.login).toBeTruthy();
    expect(data.login.success).not.toBeTruthy();
    expect(data.login.token).not.toBeTruthy();
  });

  test('Test login mutation success', async () => {
    const { mutate } = await initApolloTestClient();

    const { data } = await mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: 'user@mail.com',
        password: 'Test12345_'
      }
    });
    expect(data.login).toBeTruthy();
    expect(data.login.success).toBeTruthy();
    expect(data.login.token).toBeTruthy();
  });

  test('Test signup mutation fail, email exists', async () => {
    const { mutate } = await initApolloTestClient();

    const { data } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        fullName: 'Test User',
        email: 'user@mail.com',
        password: 'Test12345_',
        rePassword: 'Test12345_'
      }
    });
    expect(data.signup).toBeTruthy();
    expect(data.signup.success).not.toBeTruthy();
    expect(data.signup.user).not.toBeTruthy();
  });

  test('Test signup mutation fail, invalid email', async () => {
    const { mutate } = await initApolloTestClient();

    const { data, errors } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        fullName: 'Test User',
        email: 'Invalid email',
        password: 'Test12345_',
        rePassword: 'Test12345_'
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test signup mutation fail, short password', async () => {
    const { mutate } = await initApolloTestClient();

    const { data, errors } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        fullName: 'Test User',
        email: `email_${ Date.now() }@mail.com`,
        password: '123',
        rePassword: '123'
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test signup mutation fail, password doesn\'t match', async () => {
    const { mutate } = await initApolloTestClient();

    const { data, errors } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        fullName: 'Test User',
        email: `email_${ Date.now() }@mail.com`,
        password: 'Test12345_',
        rePassword: 'test12345_'
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test signup mutation success', async () => {
    const { mutate } = await initApolloTestClient();

    const { data } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        fullName: 'Test User',
        email: `user_${ Date.now() }@mail.com`,
        password: 'Test12345_',
        rePassword: 'Test12345_'
      }
    });
    expect(data.signup).toBeTruthy();
    expect(data.signup.success).toBeTruthy();
    expect(data.signup.user).toBeTruthy();
  });

  test('Test updatePersonalInfo mutation success', async () => {
    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await mutate({
      mutation: UPDATE_PERSONAL_INFO_MUTATION,
      variables: {
        fullName: 'Test User 123'
      }
    });
    expect(data.updatePersonalInfo).toBeTruthy();
    expect(data.updatePersonalInfo.fullName).toBe('Test User 123');
  });

  test('Test changePassword mutation fail, invalid current password', async () => {
    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data } = await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        password: '123',
        newPassword: 'Test12345678_',
        reNewPassword: 'Test12345678_'
      }
    });
    expect(data.changePassword).not.toBeTruthy();
  });

  test('Test changePassword mutation fail, password doesn\'t match', async () => {
    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        password: 'Test12345_',
        newPassword: 'Test12345678_',
        reNewPassword: 'test12345678_'
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test changePassword mutation fail, short password', async () => {
    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    const { data, errors } = await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        password: 'Test12345_',
        newPassword: '123',
        reNewPassword: '123'
      }
    });
    expect(data).not.toBeTruthy();
    expect(errors.length).toBeTruthy();
    expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
  });

  test('Test changePassword mutation success', async () => {
    const user = await userService.createUser({
      fullName: 'Test user',
      email: `user_${ Date.now() }@mail.com`,
      password: 'Test12345_'
    });

    const { mutate } = await initApolloTestClient({
      authUser: user
    });
    let { data } = await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        password: 'Test12345_',
        newPassword: 'Test12345678_',
        reNewPassword: 'Test12345678_'
      }
    });
    expect(data.changePassword).toBeTruthy();

    data = (await mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: user.email,
        password: 'Test12345678_'
      }
    })).data;
    expect(data.login).toBeTruthy();
    expect(data.login.success).toBeTruthy();
    expect(data.login.token).toBeTruthy();
  });
});
