namespace cs_api.Models;

public class Schedule
{
    public required string ScheduleId { get; set; }
    public string? UserId { get; set; }
    public string? GroupId { get; set; }
}

public class CreateScheduleRequest
{
    public string? UserId { get; set; }
    public string? GroupId { get; set; }
}