import ScheduleRepository from "../repository/ScheduleRepository";

class ScheduleService {

    static async getAllSchedules() {
        const schedules = await ScheduleRepository.getAllSchedules();
        return schedules;
    }

    static async getAllGroupSchedules() {
        const groupSchedules = await ScheduleRepository.getAllGroupSchedules();
        return groupSchedules;
    }

    static async getScheduleById(schedule_id: string) {
        const schedule = await ScheduleRepository.getScheduleById(schedule_id);
        return schedule;
    }

    static async createSchedule(schedule_id: string, user_id: string|null, group_id: string|null) {
        const schedule = await ScheduleRepository.createSchedule(schedule_id, user_id, group_id);
        return schedule;
    }

    static async deleteSchedule(schedule_id: string) {
        await ScheduleRepository.deleteSchedule(schedule_id);
    }

}

export default ScheduleService;