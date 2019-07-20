import { initDatabase } from '../../src/utils/database';
import { userService } from '../../src/services/user.service';
import { initApolloClient } from '../utils/apollo-client';
import {
    AUTHOR_BY_ID_QUERY, AUTHORS_QUERY,
    CREATE_AUTHOR_MUTATION,
    DEL_AUTHOR_MUTATION,
    EDIT_AUTHOR_MUTATION
} from "./author.api.test.gql";
import { authorService } from '../../src/services/author.service';
import { USER_BY_ID_QUERY, USERS_QUERY } from './user.api.test.gql';

describe('Test author api', () => {

    beforeAll(async () => {
        initDatabase();
    });

    test('Test createAuthor mutation success', async () => {
        const user = await userService.findByEmail('user@mail.com');
        const fullName = 'Test author';
        const about = 'Test about';

        const { mutate } = await initApolloClient({ authUser: user });
        const { data } = await mutate({
            mutation: CREATE_AUTHOR_MUTATION,
            variables: { fullName, about }
        });
        expect(data.createAuthor).toBeTruthy();
        expect(data.createAuthor.fullName).toBe(fullName);
        expect(data.createAuthor.about).toBe(about);
        expect(data.createAuthor.creator.id).toBe('' + user.id);
    });

    test('Test editAuthor mutation fail, id not found', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;
        await authorService.deleteAuthor(id);

        const { mutate } = await initApolloClient({ authUser: user });
        const { data, errors } = await mutate({
            mutation: EDIT_AUTHOR_MUTATION,
            variables: { id, fullName, about }
        });
        expect(data.editAuthor).not.toBeTruthy();
        expect(errors).not.toBeTruthy();
    });

    test('Test editAuthor mutation success', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;
        const newFullName = 'Test author new';
        const newAbout = 'Test about new';

        const { mutate } = await initApolloClient({ authUser: user });
        const { data } = await mutate({
            mutation: EDIT_AUTHOR_MUTATION,
            variables: { id, fullName: newFullName, about: newAbout }
        });
        expect(data.editAuthor).toBeTruthy();
        expect(data.editAuthor.fullName).toBe(newFullName);
        expect(data.editAuthor.about).toBe(newAbout);
    });

    test('Test deleteAuthor mutation fail, id not found', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;
        await authorService.deleteAuthor(id);

        const { mutate } = await initApolloClient({ authUser: user });
        const { data, errors } = await mutate({
            mutation: DEL_AUTHOR_MUTATION,
            variables: { id }
        });
        expect(data.deleteAuthor).not.toBeTruthy();
        expect(errors).not.toBeTruthy();
    });

    test('Test deleteAuthor mutation success', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;

        const { mutate } = await initApolloClient({ authUser: user });
        const { data } = await mutate({
            mutation: DEL_AUTHOR_MUTATION,
            variables: { id }
        });
        expect(data.deleteAuthor).toBeTruthy();
        expect(data.deleteAuthor.fullName).toBe(fullName);
        expect(data.deleteAuthor.about).toBe(about);
    });

    test('Test authorById query fail, id not found', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;
        await authorService.deleteAuthor(id);

        const { query } = await initApolloClient({ authUser: user });
        const { data, errors } = await query({ query: AUTHOR_BY_ID_QUERY, variables: { id } });
        expect(data.authorById).not.toBeTruthy();
        expect(errors).not.toBeTruthy();
    });

    test('Test authorById query success', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;

        const { query } = await initApolloClient({ authUser: user });
        const { data } = await query({ query: AUTHOR_BY_ID_QUERY, variables: { id } });
        expect(data.authorById).toBeTruthy();
        expect(data.authorById.fullName).toBe(fullName);
        expect(data.authorById.about).toBe(about);
    });

    test('Test authors query success', async () => {
        const user = await userService.findByEmail('user@mail.com');

        const fullName = 'Test author';
        const about = 'Test about';
        const author = await authorService.createAuthor(user.id, { fullName, about });
        const { id } = author;

        const { query } = await initApolloClient({ authUser: user });
        const { data } = await query({ query: AUTHORS_QUERY, variables: { id } });
        expect(data.authors).toBeTruthy();
        expect(Array.isArray(data.authors)).toBeTruthy();
    });
});
