import dbClient from "../dbconfig";

class ScheduleRepository {

    static async getAllSchedules() {
        const res = await dbClient.query('SELECT * FROM schedule.schedules');
        return res.rows;
    }

}

export default ScheduleRepository;