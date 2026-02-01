import ScheduleService from "../../src/service/SchedulesService";
import ScheduleRepository from "../../src/repository/ScheduleRepository";

jest.mock("../../src/repository/ScheduleRepository");

describe('ScheduleService', () => {
    const TEST_USER_1 = {
        user_id: '11111111-1111-1111-1111-111111111111',
        user_name: 'testuser',
        email: 'test1@example.com',
        password_hash: 'hash1',
    };
    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1',
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
        user_id: TEST_USER_1.user_id,
        group_id: null
    };

    it('should return a list of schedules', async () => {
        
        jest.spyOn(ScheduleRepository, 'getAllSchedules').mockResolvedValue([
            TEST_SCHEDULE_1,
            TEST_SCHEDULE_2
        ]);

        const result = await ScheduleService.getAllSchedules();

        expect(result.length).toBeGreaterThan(0);
        expect(ScheduleRepository.getAllSchedules).toHaveBeenCalledTimes(1);

    });

    it('should return a list of group schedules', async () => {
    
        jest.spyOn(ScheduleRepository, 'getAllGroupSchedules').mockResolvedValue([
            TEST_SCHEDULE_2
        ]);

        const result = await ScheduleService.getAllGroupSchedules();

        expect(result.length).toBeGreaterThan(0);
        expect(ScheduleRepository.getAllGroupSchedules).toHaveBeenCalledTimes(1);
    
    });

    it('should return a single schedule', async () => {
    
        jest.spyOn(ScheduleRepository, 'getScheduleById').mockResolvedValue([
            TEST_SCHEDULE_1
        ]);

        const result = await ScheduleService.getScheduleById(TEST_SCHEDULE_1.schedule_id);

        expect(result).toBeDefined();
        expect(ScheduleRepository.getScheduleById).toHaveBeenCalledTimes(1);
    
    });

    it('should create a new schedule', async () => {
    
        jest.spyOn(ScheduleRepository, 'createSchedule').mockResolvedValue(TEST_INSERT_SCHEDULE);

        const newSchedule = await ScheduleService.createSchedule(TEST_INSERT_SCHEDULE.user_id, TEST_INSERT_SCHEDULE.group_id);

        expect(newSchedule).toBeDefined();
        expect(newSchedule).toEqual(
            expect.objectContaining({
                user_id: newSchedule.user_id,
                group_id: newSchedule.group_id
            })
        );
        expect(ScheduleRepository.createSchedule).toHaveBeenCalledTimes(1);
    
    });

    it('should delete an existing schedule', async () => {
    
        jest.spyOn(ScheduleRepository, 'deleteSchedule').mockResolvedValue();

        const response = await ScheduleService.deleteSchedule(TEST_SCHEDULE_1.schedule_id);

        expect(response).toBeUndefined();
        expect(ScheduleRepository.deleteSchedule).toHaveBeenCalledTimes(1);
    
    });

    it('should handle errors', async () => {
    
        jest.spyOn(ScheduleRepository, 'getAllSchedules').mockRejectedValue(new Error('Database error'));
        await expect(ScheduleService.getAllSchedules()).rejects.toThrow('Database error');

        jest.spyOn(ScheduleRepository, 'getAllGroupSchedules').mockRejectedValue(new Error('Database error'));
        await expect(ScheduleService.getAllGroupSchedules()).rejects.toThrow('Database error');

        jest.spyOn(ScheduleRepository, 'getScheduleById').mockRejectedValue(new Error('Database error'));
        await expect(ScheduleService.getScheduleById(TEST_SCHEDULE_1.schedule_id)).rejects.toThrow('Database error');

        jest.spyOn(ScheduleRepository, 'createSchedule').mockRejectedValue(new Error('Database error'));
        await expect(ScheduleService.createSchedule(TEST_INSERT_SCHEDULE.user_id, TEST_INSERT_SCHEDULE.group_id)).rejects.toThrow('Database error');

        jest.spyOn(ScheduleRepository, 'deleteSchedule').mockRejectedValue(new Error('Database error'));
        await expect(ScheduleService.deleteSchedule(TEST_SCHEDULE_1.schedule_id)).rejects.toThrow('Database error');
    
    });

});