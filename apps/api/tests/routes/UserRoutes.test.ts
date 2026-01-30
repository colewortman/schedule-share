import request from 'supertest';
import { createApp } from '../../src/app';
import dbClient from '../../src/dbconfig';
import { resetCounter } from '../__mocks__/uuid';
import UserRepository from '../../src/repository/UserRepository';
import { DbTest } from '../helpers/DbTest';

describe('UserRoutes API', () => {
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
    const TEST_INSERT_USER = {
        user_name: 'testuser3',
        email: 'test3@example.com',
        password: 'testpassword',
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
        await dbHelper.cleanDatabase();
        await dbClient.end();
    });

    it('GET /api/users - should return a list of users', async () => {
        const app = createApp();
        const response = await request(app).get('/api/users');

        expect(response.body).not.toHaveProperty('password');
        expect(response.body).not.toHaveProperty('password_hash');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id: TEST_USER_1.user_id,
                    user_name: TEST_USER_1.user_name,
                    email: TEST_USER_1.email,
                }),
            ])
        );
    });

    it('GET /api/users/$id - should return a single user', async () => {
        const app = createApp();
        const response = await request(app).get(`/api/users/${TEST_USER_2.user_id}`)

        expect(response.body).not.toHaveProperty('password');
        expect(response.body).not.toHaveProperty('password_hash');

        expect(response.status).toBe(200);
        expect(response).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({
                user_id: TEST_USER_2.user_id,
                user_name: TEST_USER_2.user_name,
                email: TEST_USER_2.email,
            }),
        );
    });

    it('POST /api/users/ - should create a new user', async () => {
        const app = createApp();
        const response = await request(app)
            .post(`/api/users`)
            .send(TEST_INSERT_USER)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({
                user_id: expect.any(String),
                user_name: TEST_INSERT_USER.user_name,
                email: TEST_INSERT_USER.email,
            })
        );

        expect(response.body).not.toHaveProperty('password');
        expect(response.body).not.toHaveProperty('password_hash');

        const user_id = response.body.user_id;
        const getResponse = await request(app).get(`/api/users/${user_id}`);
        
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(
            expect.objectContaining({
                user_id: expect.any(String),
                user_name: TEST_INSERT_USER.user_name,
                email: TEST_INSERT_USER.email,
            })
        )
    });

    it('should delete an existing user', async () => {
    
        const app = createApp();
        await request(app).delete(`/api/users/${TEST_USER_2.user_id}`);

        const response = await UserRepository.getUserById(TEST_USER_2.user_id);
        expect(response).toBeUndefined();
    
    });
});