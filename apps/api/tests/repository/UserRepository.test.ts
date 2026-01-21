import UserRepository from "../../src/repository/UserRepository";
import dbClient from "../../src/dbconfig";
import { resetCounter } from '../__mocks__/uuid';

describe('UserRepository', () => {
    const TEST_USER_1 = {
        user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_name: 'testuser',
        email: 'test1@example.com',
        password_hash: 'hash1',
    };
    const TEST_USER_2 = {
        user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_name: 'testuser2',
        email: 'test2@example.com',
        password_hash: 'hash2',
    };
    const TEST_USER_3 = {
        user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        user_name: 'testuser3',
        email: 'test3@example.com',
        password_hash: 'hash3',
    };

    beforeAll(async () => {
        await dbClient.connect();
    });

    beforeEach(async () => {
        resetCounter();

        await dbClient.query(`delete from schedule.users`)

        await dbClient.query(`
            insert into schedule.users (user_id, user_name, email, password_hash)
            values 
                ($1, $2, $3, $4),
                ($5, $6, $7, $8)
        `, [
            TEST_USER_1.user_id, TEST_USER_1.user_name, TEST_USER_1.email, TEST_USER_1.password_hash,
            TEST_USER_2.user_id, TEST_USER_2.user_name, TEST_USER_2.email, TEST_USER_2.password_hash
        ]);
    });

    afterAll(async () => {
        await dbClient.query(`delete from schedule.users`);
        await dbClient.end();
    });

    it('should retrieve all users from the database', async () => {
        const users = await UserRepository.getAllUsers();
        expect(users.length).toBeGreaterThan(0);
        expect(users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id: TEST_USER_1.user_id,
                    user_name: TEST_USER_1.user_name,
                    email: TEST_USER_1.email,
                }),
                expect.objectContaining({
                    user_id: TEST_USER_2.user_id,
                    user_name: TEST_USER_2.user_name,
                    email: TEST_USER_2.email,
                })
            ])
        );
    });

    it('should retrieve a user by ID', async () => {
        const user = await UserRepository.getUserById(TEST_USER_1.user_id);
        expect(user).toBeDefined();
        expect(user).toEqual(
            expect.objectContaining({
                user_id: TEST_USER_1.user_id,
                user_name: TEST_USER_1.user_name,
                email: TEST_USER_1.email,
            }),
        );
    });

    it('should create a new user in the database', async () => {
        const newUser = await UserRepository.createUser(TEST_USER_3.user_id, TEST_USER_3.user_name, TEST_USER_3.email, TEST_USER_3.password_hash);
        expect(newUser).toBeDefined();
        expect(newUser).toEqual(
            expect.objectContaining({
                user_id: newUser.user_id,
                user_name: newUser.user_name,
                email: newUser.email,
            }),
        );
    });

    it('should update an existing user in the database', async () => {
        const updatedUser = await UserRepository.updateUser(
            TEST_USER_1.user_id,
            'updateduser',
            'updated@example.com'
        );
        expect(updatedUser).toBeDefined();
        expect(updatedUser).toEqual(
            expect.objectContaining({
                user_id: TEST_USER_1.user_id,
                user_name: 'updateduser',
                email: 'updated@example.com',
            }),
        );
    });

    it('should delete a user from the database', async () => {
        await UserRepository.deleteUser(TEST_USER_1.user_id);
        const user = await UserRepository.getUserById(TEST_USER_1.user_id);
        expect(user).toBeUndefined();
    });
});