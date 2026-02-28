using cs_api.Controllers;
using cs_api.Models;
using cs_api.Services;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ScheduleShare.Api.Tests;

public class UserControllerTests
{
    private readonly IUserService _userService;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _userService = Substitute.For<IUserService>();
        _controller = new UserController(_userService);
    }

    // --- GetAllUsers ---

    [Fact]
    public async Task GetAllUsers_ReturnsOkWithUsers()
    {
        var users = new List<User>
        {
            new() { UserId = "1", UserName = "alice", Email = "alice@test.com" },
            new() { UserId = "2", UserName = "bob", Email = "bob@test.com" }
        };
        _userService.GetAllUsers().Returns(users);

        var result = await _controller.GetAllUsers();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<User>>(ok.Value);
        Assert.Equal(2, returned.Count());
    }

    [Fact]
    public async Task GetAllUsers_ReturnsEmptyList_WhenNoUsers()
    {
        _userService.GetAllUsers().Returns(Enumerable.Empty<User>());

        var result = await _controller.GetAllUsers();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<User>>(ok.Value);
        Assert.Empty(returned);
    }

    [Fact]
    public async Task GetAllUsers_Returns500_OnException()
    {
        _userService.GetAllUsers().ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetAllUsers();

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- GetUserById ---

    [Fact]
    public async Task GetUserById_ReturnsOk_WhenFound()
    {
        var user = new User { UserId = "1", UserName = "alice", Email = "alice@test.com" };
        _userService.GetUserById("1").Returns(user);

        var result = await _controller.GetUserById("1");

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<User>(ok.Value);
        Assert.Equal("alice", returned.UserName);
    }

    [Fact]
    public async Task GetUserById_ReturnsNotFound_WhenMissing()
    {
        _userService.GetUserById("999").Returns((User?)null);

        var result = await _controller.GetUserById("999");

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetUserById_Returns500_OnException()
    {
        _userService.GetUserById("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.GetUserById("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- CreateUser ---

    [Fact]
    public async Task CreateUser_Returns201_WithCreatedUser()
    {
        var created = new User { UserId = "abc", UserName = "alice", Email = "alice@test.com" };
        _userService.CreateUser("alice", "alice@test.com", "pass123").Returns(created);

        var request = new CreateUserRequest { UserName = "alice", Email = "alice@test.com", Password = "pass123" };
        var result = await _controller.CreateUser(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, status.StatusCode);
        var returned = Assert.IsType<User>(status.Value);
        Assert.Equal("abc", returned.UserId);
    }

    [Fact]
    public async Task CreateUser_Returns500_OnException()
    {
        _userService.CreateUser(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>())
            .ThrowsAsync(new Exception("db error"));

        var request = new CreateUserRequest { UserName = "alice", Email = "alice@test.com", Password = "pass" };
        var result = await _controller.CreateUser(request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- UpdateUser ---

    [Fact]
    public async Task UpdateUser_ReturnsOk_WhenFound()
    {
        var updated = new User { UserId = "1", UserName = "alice2", Email = "alice@test.com" };
        _userService.UpdateUser("1", "alice2", null).Returns(updated);

        var request = new UpdateUserRequest { UserName = "alice2" };
        var result = await _controller.UpdateUser("1", request);

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<User>(ok.Value);
        Assert.Equal("alice2", returned.UserName);
    }

    [Fact]
    public async Task UpdateUser_ReturnsNotFound_WhenMissing()
    {
        _userService.UpdateUser("999", "alice2", null).Returns((User?)null);

        var request = new UpdateUserRequest { UserName = "alice2" };
        var result = await _controller.UpdateUser("999", request);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateUser_Returns500_OnException()
    {
        _userService.UpdateUser(Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<string?>())
            .ThrowsAsync(new Exception("db error"));

        var request = new UpdateUserRequest { UserName = "alice2" };
        var result = await _controller.UpdateUser("1", request);

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }

    // --- DeleteUser ---

    [Fact]
    public async Task DeleteUser_ReturnsNoContent()
    {
        var result = await _controller.DeleteUser("1");

        Assert.IsType<NoContentResult>(result);
        await _userService.Received(1).DeleteUser("1");
    }

    [Fact]
    public async Task DeleteUser_Returns500_OnException()
    {
        _userService.DeleteUser("1").ThrowsAsync(new Exception("db error"));

        var result = await _controller.DeleteUser("1");

        var status = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, status.StatusCode);
    }
}
