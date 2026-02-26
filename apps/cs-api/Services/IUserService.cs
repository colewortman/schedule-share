using cs_api.Models;

namespace cs_api.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User?> GetUserById(string userId);
    Task<User> CreateUser(string userName, string email, string password);
    Task<User?> UpdateUser(string userId, string? userName, string? email);
    Task DeleteUser(string userId);
}
