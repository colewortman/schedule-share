using cs_api.Models;

namespace cs_api.Repositories;

public interface IScheduleRepository
{
    Task<IEnumerable<Schedule>> GetAllSchedules();
    Task<Schedule?> GetScheduleById(string scheduleId);
    Task<Schedule> CreateSchedule(string scheduleId, string? userId, string? groupId);
    Task DeleteSchedule(string scheduleId);
}