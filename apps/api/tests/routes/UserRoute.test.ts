import request from 'supertest';
import { createApp } from '../../src/app';
import dbClient from '../../src/dbconfig';

describe('UserRoutes API', () => {
    beforeAll(async () => {
        await dbClient.connect();

        await dbClient.query(`
      INSERT INTO schedule.users (user_id, user_name, email, password_hash)
      VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Test User',
        'test@example.com',
        'hashedpassword'
      )
      ON CONFLICT DO NOTHING;
    `);
    });

    afterAll(async () => {
        await dbClient.query(`delete from schedule.users`);
        await dbClient.end();
    });

    it('GET /users - should return a list of users', async () => {
        const app = createApp();
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id: '11111111-1111-1111-1111-111111111111',
                    user_name: 'Test User',
                    email: 'test@example.com',
                }),
            ])
        );
    });
});