import UserRepository from "../../src/repository/UserRepository";
import dbClient from "../../src/dbconfig";
import { resetCounter } from '../__mocks__/uuid';
import { DbTest } from "../helpers/DbTest";

describe('UserRepository', () => {
    const TEST_USER_1 = {
        user_id: '11111111-1111-1111-1111-111111111111',
        user_name: 'testuser',
        email: 'test1@example.com',
        password_hash: 'hash1',
    };
    const TEST_USER_2 = {
        user_id: '22222222-2222-2222-2222-222222222222',
        user_name: 'testuser2',
        email: 'test2@example.com',
        password_hash: 'hash2',
    };
    const TEST_INSERT_USER = {
        user_id: '33333333-3333-3333-3333-333333333333',
        user_name: 'testuser3',
        email: 'test3@example.com',
        password_hash: 'hash3',
    };

    let dbHelper: DbTest;

    beforeAll(async () => {
        dbHelper = new DbTest(dbClient);
    });

    beforeEach(async () => {
        resetCounter();

        await dbHelper.cleanDatabase();
        await dbHelper.insertTestData({
            users: [
                TEST_USER_1,
                TEST_USER_2
            ]
        });
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
        const newUser = await UserRepository.createUser(TEST_INSERT_USER.user_id, TEST_INSERT_USER.user_name, TEST_INSERT_USER.email, TEST_INSERT_USER.password_hash);
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