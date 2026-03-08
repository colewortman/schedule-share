using cs_api.Models;

namespace cs_api.Services;

public interface IScheduleService
{
    Task<IEnumerable<Schedule>> GetAllSchedules();
    Task<Schedule?> GetScheduleById(string scheduleId);
    Task<Schedule> CreateSchedule(string? userId, string? groupId);
    Task DeleteSchedule(string scheduleId);
}