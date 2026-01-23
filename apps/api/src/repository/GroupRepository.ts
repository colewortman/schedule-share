import dbClient from "../dbconfig";

class GroupRepository {

    static async getAllGroups() {
        const res = await dbClient.query('SELECT * FROM schedule.groups');
        return res.rows;
    }

}

export default GroupRepository;