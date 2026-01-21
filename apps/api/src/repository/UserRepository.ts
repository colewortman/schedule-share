// Handle all database operations related to users

import dbClient from "../dbconfig";

class UserRepository {
  static async getAllUsers() {
    const res = await dbClient.query('SELECT * FROM schedule.users');
    return res.rows;
  }

  static async getUserById(userId: string) {
    const res = await dbClient.query('SELECT * FROM schedule.users WHERE user_id = $1', [userId]);
    return res.rows[0];
  }

  static async createUser(id: string, name: string, email: string, passwordHash: string) {
    const res = await dbClient.query(
      'INSERT INTO schedule.users (user_id, user_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, email, passwordHash]
    );
    return res.rows[0];
  }

  static async updateUser(userId: string, name?: string, email?: string) {
    const fields = [];
    const values = [];
    let query = 'UPDATE schedule.users SET ';
    let index = 1;

    if (name) {
      fields.push(`user_name = $${index++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    query += fields.join(', ') + ` WHERE user_id = $${index} RETURNING *`;
    values.push(userId);
    const res = await dbClient.query(query, values);
    return res.rows[0];
  }

  static async deleteUser(userId: string) {
    await dbClient.query('DELETE FROM schedule.users WHERE user_id = $1', [userId]);
  }
}

export default UserRepository;