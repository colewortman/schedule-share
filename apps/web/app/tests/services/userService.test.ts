import {describe, expect, it, vi, beforeEach} from 'vitest';
import {userService} from "../../services/userService";
import {fetchFromApi} from "../../services/api";
import {User} from "../../types";

vi.mock("../../services/api", () => ({
    fetchFromApi: vi.fn(),
}));

const mockFetchFromApi = vi.mocked(fetchFromApi);

describe('userService', () => { 

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all users', async () => {
    
        const mockUsers: User[] = [
            { user_id: "1", user_name: "user1", email: "user1@example.com" },
            { user_id: "2", user_name: "user2", email: "user2@example.com" },
        ];

        mockFetchFromApi.mockResolvedValue(mockUsers);

        const users = await userService.getAll();
        expect(users).toEqual(mockUsers);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/users");
    });

    it('should get a user by id', async () => {
    
        const mockUser: User = { user_id: "1", user_name: "user1", email: "user1@example.com" };

        mockFetchFromApi.mockResolvedValue(mockUser);

        const user = await userService.getById("1");
        expect(user).toEqual(mockUser);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/users/1");
    });

    it('should create a user', async () => {
    
        const mockUser: User = { user_id: "3", user_name: "user3", email: "user3@example.com" };

        mockFetchFromApi.mockResolvedValue(mockUser);

        const newUser = await userService.create({ user_name: "user3", email: "user3@example.com", password: "password123" });
        expect(newUser).toEqual(mockUser);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/users", { method: "POST", body: JSON.stringify({ user_name: "user3", email: "user3@example.com", password: "password123" }) });
    
    });

    it('should update a user', async () => {
    
        const mockUser: User = { user_id: "3", user_name: "user3", email: "user3@example.com" };

        mockFetchFromApi.mockResolvedValue(mockUser);

        const updatedUser = await userService.update("3", { user_name: "updatedUser", email: "updatedUser@example.com"});
        expect(updatedUser.user_id).toEqual(mockUser.user_id);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/users/3", { method: "PUT", body: JSON.stringify({ user_name: "updatedUser", email: "updatedUser@example.com" }) });
    });

    it('should delete a user', async () => {
    
        mockFetchFromApi.mockResolvedValue(undefined);

        await userService.delete("3");

        expect(mockFetchFromApi).toHaveBeenCalledWith("/users/3", { method: "DELETE" });
    });
});