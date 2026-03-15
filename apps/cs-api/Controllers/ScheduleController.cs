using Microsoft.AspNetCore.Mvc;
using cs_api.Models;
using cs_api.Services;

namespace cs_api.Controllers;

[ApiController]
[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public ScheduleController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSchedules()
    {
        try
        {
            var schedules = await _scheduleService.GetAllSchedules();
            return Ok(schedules);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetScheduleById(string id)
    {
        try
        {
            var schedule = await _scheduleService.GetScheduleById(id);
            if (schedule == null)
            {
                return NotFound(new { error = "Schedule not found" });
            }
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateSchedule(CreateScheduleRequest request)
    {
        try
        {
            var newSchedule = await _scheduleService.CreateSchedule(request.UserId, request.GroupId);
            return StatusCode(201, newSchedule);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchedule(string id)
    {
        try
        {
            await _scheduleService.DeleteSchedule(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }
}