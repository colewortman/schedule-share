import dbClient from "../dbconfig";

class ScheduleRepository {

    static async getAllSchedules() {
        const res = await dbClient.query('SELECT * FROM schedule.schedules');
        return res.rows;
    }

    static async getAllGroupSchedules() {
        const res = await dbClient.query('SELECT * FROM schedule.schedules WHERE group_id IS NOT NULL');
        return res.rows
    }

    static async getScheduleById(schedule_id: string) {
        const res = await dbClient.query('SELECT * FROM schedule.schedules WHERE schedule_id = $1', [schedule_id]);
        return res.rows[0];
    }

    static async createSchedule(schedule_id: string, user_id: string|null, group_id: string|null) {
        const res = await dbClient.query(
        'INSERT $1, $2, $3 INTO schedule.schedules WHERE schedule_id = $1, user_id = $2, group_id = $3',
        [schedule_id, user_id, group_id]
        );
        return res.rows[0];
    }

    static async deleteSchedule(schedule_id: string) {
        await dbClient.query('DELETE FROM schedule.schedules WHERE schedule_id = $1', [schedule_id]);
    }
    
}

export default ScheduleRepository;