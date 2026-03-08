using cs_api.Models;
using cs_api.Repositories;

namespace cs_api.Services;

public class ScheduleService : IScheduleService
{
    private readonly IScheduleRepository _scheduleRepository;

    public ScheduleService(IScheduleRepository scheduleRepository)
    {
        _scheduleRepository = scheduleRepository;
    }

    public async Task<IEnumerable<Schedule>> GetAllSchedules()
    {
        return await _scheduleRepository.GetAllSchedules();
    }

    public async Task<Schedule?> GetScheduleById(string scheduleId)
    {
        return await _scheduleRepository.GetScheduleById(scheduleId);
    }

    public async Task<Schedule> CreateSchedule(string? userId, string? groupId)
    {
        var scheduleId = Guid.NewGuid().ToString();
        return await _scheduleRepository.CreateSchedule(scheduleId, userId, groupId);
    }

    public async Task DeleteSchedule(string scheduleId)
    {
        await _scheduleRepository.DeleteSchedule(scheduleId);
    }
}