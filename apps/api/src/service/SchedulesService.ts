import ScheduleRepository from "../repository/ScheduleRepository";

class ScheduleService {

    static async getAllSchedules() {
        const schedules = await ScheduleRepository.getAllSchedules();
        return schedules;
    }

}

export default ScheduleService;