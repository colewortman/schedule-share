"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = __importDefault(require("../../src/service/UserService"));
const UserRepository_1 = __importDefault(require("../../src/repository/UserRepository"));
jest.mock('../../src/repository/UserRepository');
describe('Get All Users', () => {
    it('should return a list of users', async () => {
        const mockUsers = [
            { id: '11111111-1111-1111-1111-11111111111', name: 'Alice', email: 'alice@example.com' },
        ];
        jest.spyOn(UserRepository_1.default, 'getAllUsers').mockResolvedValue(mockUsers);
        const result = await UserService_1.default.getAllUsers();
        expect(result).toEqual(mockUsers);
        expect(UserRepository_1.default.getAllUsers).toHaveBeenCalledTimes(1);
    });
    it('should handle errors when fetching users', async () => {
        jest.spyOn(UserRepository_1.default, 'getAllUsers').mockRejectedValue(new Error('Database error'));
        await expect(UserService_1.default.getAllUsers()).rejects.toThrow('Database error');
    });
});
