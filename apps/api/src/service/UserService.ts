// Handle business logic related to users

import UserRepository from '../repository/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class UserService {
    static async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return users;
    }

    static async getUserById(user_id: string) {
        const user = await UserRepository.getUserById(user_id);
        return user;
    }

    static async createUser(user_name: string, email: string, password: string) {
        const user_id = uuidv4();
        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser(user_id, user_name, email, password_hash);
        return newUser;
    }

    static async updateUser(user_id: string, user_name?: string, email?: string) {
        const updatedUser = await UserRepository.updateUser(user_id, user_name, email);
        return updatedUser;
    }

    static async deleteUser(user_id: string) {
        await UserRepository.deleteUser(user_id);
    }
}

export default UserService;