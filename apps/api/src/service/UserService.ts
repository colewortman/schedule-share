// Handle business logic related to users

import UserRepository from '../repository/UserRepository';

class UserService {
    static async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return users;
    }

    static async getUserById(userId: string) {
        const user = await UserRepository.getUserById(userId);
        return user;
    }

    static async createUser(id: string, name: string, email: string, passwordHash: string) {
        const newUser = await UserRepository.createUser(id, name, email, passwordHash);
        return newUser;
    }

    static async updateUser(userId: string, name?: string, email?: string) {
        const updatedUser = await UserRepository.updateUser(userId, name, email);
        return updatedUser;
    }

    static async deleteUser(userId: string) {
        await UserRepository.deleteUser(userId);
    }
}

export default UserService;