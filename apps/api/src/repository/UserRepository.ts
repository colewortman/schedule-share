// Handle all database operations related to users

import dbClient from "../dbconfig";

class UserRepository {
  static async getAllUsers() {
    const res = await dbClient.query('SELECT * FROM schedule.users');
    return res.rows;
  }
}

export default UserRepository;