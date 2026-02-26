using Microsoft.AspNetCore.Mvc;
using cs_api.Models;
using cs_api.Services;

namespace cs_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        try
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest request)
    {
        try
        {
            var newUser = await _userService.CreateUser(request.UserName, request.Email, request.Password);
            return StatusCode(201, newUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, UpdateUserRequest request)
    {
        try
        {
            var updatedUser = await _userService.UpdateUser(id, request.UserName, request.Email);
            if (updatedUser == null)
            {
                return NotFound(new { error = "User not found" });
            }
            return Ok(updatedUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            await _userService.DeleteUser(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }
}
