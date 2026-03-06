using cs_api.Config;
using cs_api.Models;
using Npgsql;

namespace cs_api.Repositories;

public class ScheduleRepository : IScheduleRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public ScheduleRepository(DbConfig dbConfig)
    {
        _dataSource = dbConfig.DataSource;
    }

    public async Task<IEnumerable<Schedule>> GetAllSchedules()
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT * FROM schedule.schedules", conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var schedules = new List<Schedule>();
        while (await reader.ReadAsync())
        {
            schedules.Add(MapSchedule(reader));
        }
        return schedules;
    }

    public async Task<Schedule?> GetScheduleById(string scheduleId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "SELECT * FROM schedule.schedules WHERE schedule_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(scheduleId));
        await using var reader = await cmd.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapSchedule(reader) : null;
    }

    public async Task<Schedule> CreateSchedule(string scheduleId, string? userId, string? groupId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "INSERT INTO schedule.schedules (schedule_id, user_id, group_id) VALUES (@id, @user, @group) RETURNING schedule_id, user_id, group_id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(scheduleId));
        cmd.Parameters.AddWithValue("user", userId != null ? Guid.Parse(userId) : DBNull.Value);
        cmd.Parameters.AddWithValue("group", groupId != null ? Guid.Parse(groupId) : DBNull.Value);
        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();
        return MapSchedule(reader);
    }

    public async Task DeleteSchedule(string scheduleId)
    {
        await using var conn = await _dataSource.OpenConnectionAsync();
        await using var cmd = new NpgsqlCommand(
            "DELETE FROM schedule.schedules WHERE schedule_id = @id", conn);
        cmd.Parameters.AddWithValue("id", Guid.Parse(scheduleId));
        await cmd.ExecuteNonQueryAsync();
    }

    private static Schedule MapSchedule(NpgsqlDataReader reader) => new()
    {
        ScheduleId = reader.GetGuid(0).ToString(),
        UserId = reader.IsDBNull(1) ? null : reader.GetGuid(1).ToString(),
        GroupId = reader.IsDBNull(2) ? null : reader.GetGuid(2).ToString()
    };
}