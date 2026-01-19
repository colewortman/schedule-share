import UserService from '../../src/service/UserService';
import UserRepository from '../../src/repository/UserRepository';

jest.mock('../../src/repository/UserRepository');

describe('Get All Users', () => {
    it('should return a list of users', async () => {
        
        const mockUsers = [
            { id: '11111111-1111-1111-1111-11111111111', name: 'Alice', email: 'alice@example.com' },
        ];

        jest.spyOn(UserRepository, 'getAllUsers').mockResolvedValue(mockUsers);

        const result = await UserService.getAllUsers();

        expect(result).toEqual(mockUsers);
        expect(UserRepository.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching users', async () => {

        jest.spyOn(UserRepository, 'getAllUsers').mockRejectedValue(new Error('Database error'));

        await expect(UserService.getAllUsers()).rejects.toThrow('Database error');
    });
});