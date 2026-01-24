import request from 'supertest';
import { createApp } from '../../src/app';
import dbClient from '../../src/dbconfig';
import { resetCounter } from '../__mocks__/uuid';

describe('GroupRoutes API', () => {
    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1'
    }
    const TEST_GROUP_2 = {
        group_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        group_name: 'test2'
    }

    beforeAll(async () => {
        await dbClient.connect();
    });
    
    beforeEach(async () => {
    
        resetCounter();

        await dbClient.query('delete from schedule.groups')

        await dbClient.query(`
            insert into schedule.groups (group_id, group_name)
            values 
                ($1, $2),
                ($3, $4)
        `, [
            TEST_GROUP_1.group_id, TEST_GROUP_1.group_name,
            TEST_GROUP_2.group_id, TEST_GROUP_2.group_name
        ]);
    });

    afterAll(async () => {
        await dbClient.query('delete from schedule.groups');
        await dbClient.end();
    });

    it('GET /api/groups - should return a list of groups', async () => {
    
        const app = createApp();
        const response = await request(app).get('/api/groups');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    group_id: TEST_GROUP_1.group_id,
                    group_name: TEST_GROUP_1.group_name
                }),
                expect.objectContaining({
                    group_id: TEST_GROUP_2.group_id,
                    group_name: TEST_GROUP_2.group_name
                })
            ])
        );
    });
})