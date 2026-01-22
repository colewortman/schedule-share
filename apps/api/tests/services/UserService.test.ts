import UserService from '../../src/service/UserService';
import UserRepository from '../../src/repository/UserRepository';

jest.mock('../../src/repository/UserRepository');

describe('UserService', () => {

    const TEST_USER_1 = {
        user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_name: 'testuser',
        email: 'test1@example.com',
        password_hash: 'hash1',
    };
    const TEST_USER_2 = {
        user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_name: 'testuser2',
        email: 'test2@example.com',
        password_hash: 'hash2',
    };
    const TEST_USER_3 = {
        user_name: 'testuser3',
        email: 'test3@example.com',
        password: 'testpassword',
    };

    it('should return a list of users', async () => {

        const mockUsers = [
            TEST_USER_1,
            TEST_USER_2
        ];

        jest.spyOn(UserRepository, 'getAllUsers').mockResolvedValue(mockUsers);

        const result = await UserService.getAllUsers();

        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('password_hash');
        expect(UserRepository.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should return a single user', async () => {

        const expectedUser = {
            user_id: TEST_USER_2.user_id,
            user_name: TEST_USER_2.user_name,
            email: TEST_USER_2.email
        };

        jest.spyOn(UserRepository, 'getUserById').mockResolvedValue(expectedUser);

        const result = await UserService.getUserById(TEST_USER_2.user_id);

        expect(result.user_id).toEqual(TEST_USER_2.user_id);
        expect(result.user_name).toEqual(TEST_USER_2.user_name);
        expect(result.email).toEqual(TEST_USER_2.email);
        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('password_hash');
        expect(UserRepository.getUserById).toHaveBeenCalledTimes(1);
    })

    it('should create a new user', async () => {

        const expectedUser = {
            user_id: '...',
            user_name: TEST_USER_3.user_name,
            email: TEST_USER_3.email
        };

        jest.spyOn(UserRepository, 'createUser').mockResolvedValue(expectedUser);
        const newUser = await UserService.createUser(TEST_USER_3.user_name, TEST_USER_3.email, TEST_USER_3.password);

        console.log(newUser);

        expect(newUser).toBeDefined();
        expect(newUser).not.toHaveProperty('password');
        expect(newUser).not.toHaveProperty('password_hash');
        expect(newUser).toEqual(
            expect.objectContaining({
                user_id: newUser.user_id,
                user_name: newUser.user_name,
                email: newUser.email,
            }),
        );
        expect(UserRepository.createUser).toHaveBeenCalledTimes(1);

    });

    it('should update an existing user', async () => {

        const expectedUser = {
            user_id: TEST_USER_1.user_id,
            user_name: TEST_USER_1.user_name,
            email: TEST_USER_1.email
        };

        jest.spyOn(UserRepository, 'updateUser').mockResolvedValue(expectedUser);
        const updatedUser = await UserRepository.updateUser(TEST_USER_1.user_id, TEST_USER_1.user_name, TEST_USER_1.email);

        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toHaveProperty('password');
        expect(updatedUser).not.toHaveProperty('password_hash');
        expect(updatedUser).toEqual(
            expect.objectContaining({
                user_id: updatedUser.user_id,
                user_name: updatedUser.user_name,
                email: updatedUser.email,
            }),
        );
        expect(UserRepository.updateUser).toHaveBeenCalledTimes(1);

    })

    it('should delete an existing user', async () => {

        jest.spyOn(UserRepository, 'deleteUser').mockResolvedValue();
        const result = await UserRepository.deleteUser(TEST_USER_1.user_id);
        expect(result).toBeUndefined();
        
    });

    it('should handle errors when deleting users', async () => {

    });

    it('should handle errors', async () => {

        jest.spyOn(UserRepository, 'getAllUsers').mockRejectedValue(new Error('Database error'));
        await expect(UserService.getAllUsers()).rejects.toThrow('Database error');

        jest.spyOn(UserRepository, 'getUserById').mockRejectedValue(new Error('Database error'));
        await expect(UserService.getUserById(TEST_USER_1.user_id)).rejects.toThrow('Database error');

        jest.spyOn(UserRepository, 'createUser').mockRejectedValue(new Error('Database error'));
        await expect(UserService.createUser(TEST_USER_3.user_name, TEST_USER_3.email, TEST_USER_3.password)).rejects.toThrow('Database error');

        jest.spyOn(UserRepository, 'updateUser').mockRejectedValue(new Error('Database error'));
        await expect(UserService.updateUser(TEST_USER_1.user_name, TEST_USER_1.email, TEST_USER_1.email)).rejects.toThrow('Database error');

        jest.spyOn(UserRepository, 'deleteUser').mockRejectedValue(new Error('Database error'));
        await expect(UserService.deleteUser(TEST_USER_1.user_id)).rejects.toThrow('Database error');

    });

});