// Handle all database operations related to users

import dbClient from "../dbconfig";

class UserRepository {
  static async getAllUsers() {
    const res = await dbClient.query('SELECT user_id, user_name, email FROM schedule.users');
    return res.rows;
  }

  static async getUserById(user_id: string) {
    const res = await dbClient.query('SELECT user_id, user_name, email FROM schedule.users WHERE user_id = $1', [user_id]);
    return res.rows[0];
  }

  static async createUser(user_id: string, user_name: string, email: string, passwordHash: string) {
    const res = await dbClient.query(
      'INSERT INTO schedule.users (user_id, user_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id, user_name, email',
      [user_id, user_name, email, passwordHash]
    );
    return res.rows[0];
  }

  static async updateUser(user_id: string, user_name?: string, email?: string) {
    const fields = [];
    const values = [];
    let query = 'UPDATE schedule.users SET ';
    let index = 1;

    if (user_name) {
      fields.push(`user_name = $${index++}`);
      values.push(user_name);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    query += fields.join(', ') + ` WHERE user_id = $${index} RETURNING *`;
    values.push(user_id);
    const res = await dbClient.query(query, values);
    return res.rows[0];
  }

  static async deleteUser(user_id: string) {
    await dbClient.query('DELETE FROM schedule.users WHERE user_id = $1', [user_id]);
  }
}

export default UserRepository;