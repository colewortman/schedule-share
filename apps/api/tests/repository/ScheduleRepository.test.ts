import ScheduleRepository from "../../src/repository/ScheduleRepository";
import dbClient from "../../src/dbconfig";
import { resetCounter } from "../__mocks__/uuid";

describe('Schedule Repository', () => { 
    
    const TEST_USER_1 = {
        user_id: '11111111-1111-1111-1111-111111111111',
        user_name: 'scheduletestuser',
        email: 'schedule@example.com',
        password_hash: 'schedulehash',
    };
    const TEST_GROUP_1 = {
        group_id: '22222222-2222-2222-2222-222222222222',
        group_name: 'test1',
    };

    const TEST_SCHEDULE_1 = {
        schedule_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: '11111111-1111-1111-1111-111111111111',
        group_id: null,
    };
    const TEST_SCHEDULE_2 = {
        schedule_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_id: null,
        group_id: '22222222-2222-2222-2222-222222222222',
    };

    beforeAll(async () => {
        await dbClient.connect();
    });

    beforeEach(async () => {
    
        resetCounter();

        await dbClient.query('delete from schedule.users');
        await dbClient.query('delete from schedule.groups');
        await dbClient.query('delete from schedule.schedules');

        await dbClient.query(`
            insert into schedule.users (user_id, user_name, email, password_hash)
            values
                ($1, $2, $3, $4)  
        `, [TEST_USER_1.user_id, TEST_USER_1.user_name, TEST_USER_1.email, TEST_USER_1.password_hash]);

        await dbClient.query(`
            insert into schedule.groups (group_id, group_name)
            values
                ($1, $2)
        `, [TEST_GROUP_1.group_id, TEST_GROUP_1.group_name]);

        await dbClient.query(`
            insert into schedule.schedules (schedule_id, user_id, group_id)
            values
                ($1, $2, $3),
                ($4, $5, $6)
        `, [
            TEST_SCHEDULE_1.schedule_id, TEST_SCHEDULE_1.user_id, TEST_SCHEDULE_1.group_id,
            TEST_SCHEDULE_2.schedule_id, TEST_SCHEDULE_2.user_id, TEST_SCHEDULE_2.group_id
        ]);
    });
    
    afterAll(async () => {
        await dbClient.query('delete from schedule.users');
        await dbClient.query('delete from schedule.groups');
        await dbClient.query('delete from schedule.schedules');
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
                    group_id: TEST_SCHEDULE_1.group_id,
                }),
                expect.objectContaining({
                    schedule_id: TEST_SCHEDULE_2.schedule_id,
                    user_id: TEST_SCHEDULE_2.user_id,
                    group_id: TEST_SCHEDULE_2.group_id,
                })
        ]));
    });

});