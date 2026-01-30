import ScheduleRepository from "../../src/repository/ScheduleRepository";
import dbClient from "../../src/dbconfig";
import { resetCounter } from "../__mocks__/uuid";
import { DbTest } from "../helpers/DbTest";

describe('Schedule Repository', () => {

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
    const TEST_INSERT_SCHEDULE_1 = {
        schedule_id: '33333333-3333-3333-3333-333333333333',
        user_id: TEST_USER_2.user_id,
        group_id: null
    };
    const TEST_INSERT_SCHEDULE_2 = {
        schedule_id: '44444444-4444-4444-4444-444444444444',
        user_id: null,
        group_id: TEST_GROUP_2.group_id
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
            ],
            groups: [
                TEST_GROUP_1,
                TEST_GROUP_2
            ],
            schedules: [
                TEST_SCHEDULE_1,
                TEST_SCHEDULE_2
            ],
        });
    });
    
    afterAll(async () => {
        await dbHelper.cleanDatabase();
        await dbClient.end();
    });

    it('should get all schedules', async () => {
    
        const schedules = await ScheduleRepository.getAllSchedules();

        expect(schedules).toBeDefined();
        expect(schedules.length).toBeGreaterThan(0);
        expect(schedules).toEqual(
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

    it('should get all group schedules', async () => {
    
        const schedules = await ScheduleRepository.getAllGroupSchedules();

        expect(schedules).toBeDefined();
        expect(schedules.length).toBeGreaterThan(0);
        expect(schedules).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_2.schedule_id,
                    user_id: TEST_SCHEDULE_2.user_id,
                    group_id: TEST_SCHEDULE_2.group_id
                })
            ])
        );
    });
    
    it('should get one schedule from the database', async () => {
    
        const schedule = await ScheduleRepository.getScheduleById(TEST_SCHEDULE_1.schedule_id);

        expect(schedule).toBeDefined();
        expect(schedule).toEqual(
            expect.objectContaining({
                schedule_id: TEST_SCHEDULE_1.schedule_id,
                user_id: TEST_SCHEDULE_1.user_id,
                group_id: TEST_SCHEDULE_1.group_id
            })
        );
    });

    it('should create a new schedule in the database', async () => {
    
        const newSchedule1 = await ScheduleRepository.createSchedule(
            TEST_INSERT_SCHEDULE_1.schedule_id, 
            TEST_INSERT_SCHEDULE_1.user_id, 
            TEST_INSERT_SCHEDULE_1.group_id
        );
        const newSchedule2 = await ScheduleRepository.createSchedule(
            TEST_INSERT_SCHEDULE_2.schedule_id,
            TEST_INSERT_SCHEDULE_2.user_id,
            TEST_INSERT_SCHEDULE_2.group_id
        );
        expect(newSchedule1).toBeDefined();
        expect(newSchedule1).toEqual(
            expect.objectContaining({
                schedule_id: newSchedule1.schedule_id,
                user_id: newSchedule1.user_id,
                group_id: newSchedule1.group_id
            }),
        );
        expect(newSchedule2).toBeDefined();
        expect(newSchedule2).toEqual(
            expect.objectContaining({
                schedule_id: newSchedule2.schedule_id,
                user_id: newSchedule2.user_id,
                group_id: newSchedule2.group_id
            }),
        );
    });

    it('should delete an existing schedule in the database', async () => {
    
        await ScheduleRepository.deleteSchedule(TEST_SCHEDULE_1.schedule_id);
        const schedule = await ScheduleRepository.getScheduleById(TEST_SCHEDULE_1.schedule_id);

        expect(schedule).toBeUndefined();
        
    });
});