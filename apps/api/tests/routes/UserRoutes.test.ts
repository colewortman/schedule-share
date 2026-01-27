import request from 'supertest';
import { createApp } from '../../src/app';
import dbClient from '../../src/dbconfig';
import { resetCounter } from '../__mocks__/uuid';
import UserRepository from '../../src/repository/UserRepository';

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
    const TEST_USER_3 = {
        user_name: 'testuser3',
        email: 'test3@example.com',
        password: 'testpassword',
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
            .send(TEST_USER_3)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({
                user_id: expect.any(String),
                user_name: TEST_USER_3.user_name,
                email: TEST_USER_3.email,
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
                user_name: TEST_USER_3.user_name,
                email: TEST_USER_3.email,
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