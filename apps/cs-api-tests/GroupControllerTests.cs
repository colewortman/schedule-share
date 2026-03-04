using cs_api.Controllers;
using cs_api.Models;
using cs_api.Services;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ScheduleShare.Api.Tests;

public class GroupControllerTests
{
    private readonly IGroupService _groupService;
    private readonly GroupController _controller;

    public GroupControllerTests()
    {
        _groupService = Substitute.For<IGroupService>();
        _controller = new GroupController(_groupService);
    }

    // --- GetAllGroups ---

    [Fact]
    public async Task GetAllGroups_ReturnsOkWithGroups()
    {
        var groups = new List<Group>
        {
            new() {GroupId = "1", GroupName = "test1"},
            new() {GroupId = "2", GroupName = "test2"}
        };
        _groupService.GetAllGroups().Returns(groups);

        var result = await _controller.GetAllGroups();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<Group>>(ok.Value);
        Assert.Equal(2, returned.Count());
    }

    [Fact]
    public async Task GetAllGroups_ReturnsEmptyList_WhenNoGroups()
    {
        _groupService.GetAllGroups().Returns(Enumerable.Empty<Group>());

        var result = await _controller.GetAllGroups();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<Group>>(ok.Value);
        Assert.Empty(returned);
    }

    [Fact]
    public async Task GetAllGroups_Returns500_OnException()
    {
        _groupService.GetAllGroups().ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetAllGroups();

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- GetGroupById ---

    [Fact]
    public async Task GetGroupById_ReturnsOk_WhenFound()
    {
        var group = new Group { GroupId = "1", GroupName = "test1" };
        _groupService.GetGroupById("1").Returns(group);

        var result = await _controller.GetGroupById("1");

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Group>(ok.Value);
        Assert.Equal("test1", returned.GroupName);
    }

    [Fact]
    public async Task GetGroupById_ReturnsNotFound_WhenMissing()
    {
        _groupService.GetGroupById("999").Returns((Group?)null);

        var result = await _controller.GetGroupById("999");

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetGroupById_Returns500_OnException()
    {
        _groupService.GetGroupById("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetGroupById("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- CreateGroup ---

    [Fact]
    public async Task CreateGroup_Returns201_WithCreatedGroup()
    {
        var created = new Group { GroupId = "abc", GroupName = "test1" };
        _groupService.CreateGroup("test1").Returns(created);

        var request = new CreateGroupRequest { GroupName = "test1" };
        var result = await _controller.CreateGroup(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, status.StatusCode);
        var returned = Assert.IsType<Group>(status.Value);
        Assert.Equal("abc", returned.GroupId);
    }

    [Fact]
    public async Task CreateGroup_Returns500_OnException()
    {
        _groupService.CreateGroup(Arg.Any<string>())
            .ThrowsAsync(new Exception("db error"));

        var request = new CreateGroupRequest { GroupName = "test1" };
        var result = await _controller.CreateGroup(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- UpdateGroup ---

    [Fact]
    public async Task UpdateGroup_ReturnsOk_WhenFound()
    {
        var updated = new Group { GroupId = "1", GroupName = "test2" };
        _groupService.UpdateGroup("1", "test2").Returns(updated);

        var request = new UpdateGroupRequest { GroupName = "test2" };
        var result = await _controller.UpdateGroup("1", request);

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Group>(ok.Value);
        Assert.Equal("test2", returned.GroupName);
    }

    [Fact]
    public async Task UpdateGroup_ReturnsNotFound_WhenMissing()
    {
        _groupService.UpdateGroup("999", "test2").Returns((Group?)null);

        var request = new UpdateGroupRequest { GroupName = "test2" };
        var result = await _controller.UpdateGroup("999", request);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateGroup_Returns500_OnException()
    {
        _groupService.UpdateGroup(Arg.Any<string>(), Arg.Any<string?>())
            .ThrowsAsync(new Exception("db error"));

        var request = new UpdateGroupRequest { GroupName = "test2" };
        var result = await _controller.UpdateGroup("1", request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- DeleteGroup ---

    [Fact]
    public async Task DeleteGroup_ReturnsNoContent()
    {
        var result = await _controller.DeleteGroup("1");

        Assert.IsType<NoContentResult>(result);
        await _groupService.Received(1).DeleteGroup("1");
    }

    [Fact]
    public async Task DeleteGroup_Returns500_OnException()
    {
        _groupService.DeleteGroup("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.DeleteGroup("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }
}