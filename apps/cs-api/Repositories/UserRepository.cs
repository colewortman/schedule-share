using cs_api.Config;
using cs_api.Models;
using Npgsql;

namespace cs_api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public UserRepository(DbConfig dbConfig)
    {
        _dataSource = dbConfig.DataSource;
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT user_id, user_name, email FROM schedule.users", conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var users = new List<User>();
        while (await reader.ReadAsync())
        {
            users.Add(MapUser(reader));
        }
        return users;
    }

    public async Task<User?> GetUserById(string userId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT user_id, user_name, email FROM schedule.users WHERE user_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(userId));
        await using var reader = await cmd.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapUser(reader) : null;
    }

    public async Task<User> CreateUser(string userId, string userName, string email, string passwordHash)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "INSERT INTO schedule.users (user_id, user_name, email, password_hash) VALUES (@id, @name, @email, @hash) RETURNING user_id, user_name, email", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(userId));
        cmd.Parameters.AddWithValue("name", userName);
        cmd.Parameters.AddWithValue("email", email);
        cmd.Parameters.AddWithValue("hash", passwordHash);
        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();
        return MapUser(reader);
    }

    public async Task<User?> UpdateUser(string userId, string? userName, string? email)
    {
        var fields = new List<string>();
        var parameters = new List<NpgsqlParameter>();
        var index = 1;

        if (userName != null)
        {
            fields.Add($"user_name = @p{index}");
            parameters.Add(new NpgsqlParameter($"p{index++}", userName));
        }
        if (email != null)
        {
            fields.Add($"email = @p{index}");
            parameters.Add(new NpgsqlParameter($"p{index++}", email));
        }

        if (fields.Count == 0) return null;

        var sql = $"UPDATE schedule.users SET {string.Join(", ", fields)} WHERE user_id = @id RETURNING user_id, user_name, email";
        parameters.Add(new NpgsqlParameter("id", Guid.Parse(userId)));

        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddRange(parameters.ToArray());
        await using var reader = await cmd.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapUser(reader) : null;
    }

    public async Task DeleteUser(string userId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "DELETE FROM schedule.users WHERE user_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(userId));
        await cmd.ExecuteNonQueryAsync();
    }

    private static User MapUser(NpgsqlDataReader reader) => new()
    {
        UserId = reader.GetGuid(0).ToString(),
        UserName = reader.GetString(1),
        Email = reader.GetString(2)
    };
}
