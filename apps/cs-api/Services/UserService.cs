using cs_api.Models;
using cs_api.Repositories;

namespace cs_api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _userRepository.GetAllUsers();
    }

    public async Task<User?> GetUserById(string userId)
    {
        return await _userRepository.GetUserById(userId);
    }

    public async Task<User> CreateUser(string userName, string email, string password)
    {
        var userId = Guid.NewGuid().ToString();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);
        return await _userRepository.CreateUser(userId, userName, email, passwordHash);
    }

    public async Task<User?> UpdateUser(string userId, string? userName, string? email)
    {
        return await _userRepository.UpdateUser(userId, userName, email);
    }

    public async Task DeleteUser(string userId)
    {
        await _userRepository.DeleteUser(userId);
    }
}
