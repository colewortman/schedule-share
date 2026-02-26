using cs_api.Models;

namespace cs_api.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User?> GetUserById(string userId);
    Task<User> CreateUser(string userId, string userName, string email, string passwordHash);
    Task<User?> UpdateUser(string userId, string? userName, string? email);
    Task DeleteUser(string userId);
}
