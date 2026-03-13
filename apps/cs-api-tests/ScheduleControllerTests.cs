using cs_api.Controllers;
using cs_api.Models;
using cs_api.Services;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ScheduleShare.Api.Tests;

public class ScheduleControllerTests
{
    private readonly IScheduleService _scheduleService;
    private readonly ScheduleController _controller;

    public ScheduleControllerTests()
    {
        _scheduleService = Substitute.For<IScheduleService>();
        _controller = new ScheduleController(_scheduleService);
    }

    // --- GetAllSchedules ---

    [Fact]
    public async Task GetAllSchedules_ReturnsOkWithSchedules()
    {
        var schedules = new List<Schedule>
        {
            new() { ScheduleId = "1", UserId = "u1", GroupId = "g1" },
            new() { ScheduleId = "2", UserId = "u2", GroupId = "g2" }
        };
        _scheduleService.GetAllSchedules().Returns(schedules);

        var result = await _controller.GetAllSchedules();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);
        Assert.Equal(2, returned.Count());
    }

    [Fact]
    public async Task GetAllSchedules_ReturnsEmptyList_WhenNoSchedules()
    {
        _scheduleService.GetAllSchedules().Returns(Enumerable.Empty<Schedule>());

        var result = await _controller.GetAllSchedules();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<Schedule>>(ok.Value);
        Assert.Empty(returned);
    }

    [Fact]
    public async Task GetAllSchedules_Returns500_OnException()
    {
        _scheduleService.GetAllSchedules().ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetAllSchedules();

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- GetScheduleById ---

    [Fact]
    public async Task GetScheduleById_ReturnsOk_WhenFound()
    {
        var schedule = new Schedule { ScheduleId = "1", UserId = "u1", GroupId = "g1" };
        _scheduleService.GetScheduleById("1").Returns(schedule);

        var result = await _controller.GetScheduleById("1");

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Schedule>(ok.Value);
        Assert.Equal("1", returned.ScheduleId);
    }

    [Fact]
    public async Task GetScheduleById_ReturnsNotFound_WhenMissing()
    {
        _scheduleService.GetScheduleById("999").Returns((Schedule?)null);

        var result = await _controller.GetScheduleById("999");

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetScheduleById_Returns500_OnException()
    {
        _scheduleService.GetScheduleById("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetScheduleById("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- CreateSchedule ---

    [Fact]
    public async Task CreateSchedule_Returns201_WithCreatedSchedule()
    {
        var created = new Schedule { ScheduleId = "abc", UserId = "u1", GroupId = "g1" };
        _scheduleService.CreateSchedule("u1", "g1").Returns(created);

        var request = new CreateScheduleRequest { UserId = "u1", GroupId = "g1" };
        var result = await _controller.CreateSchedule(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, status.StatusCode);
        var returned = Assert.IsType<Schedule>(status.Value);
        Assert.Equal("abc", returned.ScheduleId);
    }

    [Fact]
    public async Task CreateSchedule_Returns500_OnException()
    {
        _scheduleService.CreateSchedule(Arg.Any<string?>(), Arg.Any<string?>())
            .ThrowsAsync(new Exception("db error"));

        var request = new CreateScheduleRequest { UserId = "u1", GroupId = "g1" };
        var result = await _controller.CreateSchedule(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- DeleteSchedule ---

    [Fact]
    public async Task DeleteSchedule_ReturnsNoContent()
    {
        var result = await _controller.DeleteSchedule("1");

        Assert.IsType<NoContentResult>(result);
        await _scheduleService.Received(1).DeleteSchedule("1");
    }

    [Fact]
    public async Task DeleteSchedule_Returns500_OnException()
    {
        _scheduleService.DeleteSchedule("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.DeleteSchedule("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }
}
