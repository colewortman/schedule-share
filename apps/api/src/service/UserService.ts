// Handle business logic related to users

import UserRepository from '../repository/UserRepository';

class UserService {
    static async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return users;
    }
}

export default UserService;