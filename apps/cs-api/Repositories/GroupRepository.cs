using cs_api.Config;
using cs_api.Models;
using Npgsql;

namespace cs_api.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public GroupRepository(DbConfig dbConfig)
    {
        _dataSource = dbConfig.DataSource;
    }

    public async Task<IEnumerable<Group>> GetAllGroups()
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT group_id, group_name FROM schedule.groups", conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var groups = new List<Group>();
        while (await reader.ReadAsync())
        {
            groups.Add(MapGroup(reader));
        }
        return groups;
    }

    public async Task<Group?> GetGroupById(string groupId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT group_id, group_name FROM schedule.groups WHERE group_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(groupId));
        await using var reader = await cmd.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapGroup(reader) : null;
    }

    public async Task<Group> CreateGroup(string groupId, string groupName)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "INSERT INTO schedule.groups (group_id, group_name) VALUES (@id, @name) RETURNING group_id, group_name", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(groupId));
        cmd.Parameters.AddWithValue("name", groupName);
        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();
        return MapGroup(reader);
    }

    public async Task<Group?> UpdateGroup(string groupId, string? groupName)
    {
        if (groupName == null) return null;

        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "UPDATE schedule.groups SET group_name = @name WHERE group_id = @id RETURNING group_id, group_name", conn);
        cmd.Parameters.AddWithValue("name", groupName);
        cmd.Parameters.AddWithValue("id", Guid.Parse(groupId));
        await using var reader = await cmd.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapGroup(reader) : null;
    }

    public async Task DeleteGroup(string groupId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "DELETE FROM schedule.groups WHERE group_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(groupId));
        await cmd.ExecuteNonQueryAsync();
    }

    private static Group MapGroup(NpgsqlDataReader reader) => new()
    {
        GroupId = reader.GetGuid(0).ToString(),
        GroupName = reader.GetString(1)
    };
}