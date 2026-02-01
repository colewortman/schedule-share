import request from 'supertest';
import { createApp } from '../../src/app';
import dbClient from '../../src/dbconfig';
import { resetCounter } from '../__mocks__/uuid';
import ScheduleRepository from '../../src/repository/ScheduleRepository';
import { DbTest } from '../helpers/DbTest';

describe('ScheduleRoutes API', () => {
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
    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1',
    };
    const TEST_GROUP_2 = {
        group_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        group_name: 'test2',
    };
    const TEST_SCHEDULE_1 = {
        schedule_id: '11111111-1111-1111-1111-111111111111',
        user_id: TEST_USER_1.user_id,
        group_id: null
    };
    const TEST_SCHEDULE_2 = {
        schedule_id: '22222222-2222-2222-2222-222222222222',
        user_id: null,
        group_id: TEST_GROUP_1.group_id
    };
    const TEST_INSERT_SCHEDULE = {
        user_id: TEST_USER_2.user_id,
        group_id: null
    };

    let dbHelper: DbTest;

    beforeAll(async () => {
        dbHelper = new DbTest(dbClient);
    });

    beforeEach(async () => {
        resetCounter();

        await dbHelper.cleanDatabase();
        await dbHelper.insertTestData({
            users: [TEST_USER_1, TEST_USER_2],
            groups: [TEST_GROUP_1, TEST_GROUP_2],
            schedules: [TEST_SCHEDULE_1, TEST_SCHEDULE_2]
        });
    });

    afterAll(async () => {
        await dbHelper.cleanDatabase();
        await dbClient.end();
    });

    it('GET /api/schedules - should return a list of schedules', async () => {
        const app = createApp();
        const response = await request(app).get('/api/schedules');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_1.schedule_id,
                    user_id: TEST_SCHEDULE_1.user_id,
                    group_id: TEST_SCHEDULE_1.group_id
                }),
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_2.schedule_id,
                    user_id: TEST_SCHEDULE_2.user_id,
                    group_id: TEST_SCHEDULE_2.group_id
                })
            ])
        );
    });

    it('GET /api/schedules/groups - should return only group schedules', async () => {
        const app = createApp();
        const response = await request(app).get('/api/schedules/groups');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_2.schedule_id,
                    user_id: TEST_SCHEDULE_2.user_id,
                    group_id: TEST_SCHEDULE_2.group_id
                })
            ])
        );
        expect(response.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_1.schedule_id
                })
            ])
        );
    });

    it('GET /api/schedules/:id - should return a single schedule', async () => {
        const app = createApp();
        const response = await request(app).get(`/api/schedules/${TEST_SCHEDULE_1.schedule_id}`);

        expect(response.status).toBe(200);
        expect(response).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({
                schedule_id: TEST_SCHEDULE_1.schedule_id,
                user_id: TEST_SCHEDULE_1.user_id,
                group_id: TEST_SCHEDULE_1.group_id
            })
        );
    });

    it('POST /api/schedules - should create a new schedule', async () => {
        const app = createApp();
        const response = await request(app)
            .post('/api/schedules')
            .send(TEST_INSERT_SCHEDULE)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({
                schedule_id: expect.any(String),
                user_id: TEST_INSERT_SCHEDULE.user_id,
                group_id: TEST_INSERT_SCHEDULE.group_id
            })
        );

        const getResponse = await request(app).get(`/api/schedules/${response.body.schedule_id}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(
            expect.objectContaining({
                schedule_id: expect.any(String),
                user_id: TEST_INSERT_SCHEDULE.user_id,
                group_id: TEST_INSERT_SCHEDULE.group_id
            })
        );
    });

    it('POST /api/schedules - should create a new group schedule', async () => {
        const app = createApp();
        const groupSchedule = {
            user_id: null,
            group_id: TEST_GROUP_2.group_id
        };

        const response = await request(app)
            .post('/api/schedules')
            .send(groupSchedule)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                schedule_id: expect.any(String),
                user_id: groupSchedule.user_id,
                group_id: groupSchedule.group_id
            })
        );
    });

    it('DELETE /api/schedules/:id - should delete an existing schedule', async () => {
        const app = createApp();
        const response = await request(app).delete(`/api/schedules/${TEST_SCHEDULE_2.schedule_id}`);

        expect(response.status).toBe(204);

        const schedule = await ScheduleRepository.getScheduleById(TEST_SCHEDULE_2.schedule_id);
        expect(schedule).toBeUndefined();
    });
});