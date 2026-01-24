import dbClient from "../dbconfig";

class GroupRepository {

    static async getAllGroups() {
        const res = await dbClient.query('SELECT * FROM schedule.groups');
        return res.rows;
    }

    static async getGroupById(group_id: string) {
        const res = await dbClient.query('SELECT * FROM schedule.groups where group_id = $1', [group_id]);
        return res.rows[0];
    }

    static async createGroup(group_id: string, group_name: string) {
        const res = await dbClient.query(
            'INSERT INTO schedule.groups (group_id, group_name) VALUES ($1, $2) RETURNING *',
            [group_id, group_name]
        );
        return res.rows[0];
    }

    static async updateGroup(group_id: string, group_name: string) {
        const res = await dbClient.query(
            'UPDATE schedule.groups SET group_name = $1 WHERE group_id = $2 RETURNING *',
            [group_name, group_id]
        );
        return res.rows[0];
    }

    static async deleteGroup(group_id: string) {
        await dbClient.query(
            'DELETE FROM schedule.groups where group_id = $1',
            [group_id]
        );
    }
}

export default GroupRepository;