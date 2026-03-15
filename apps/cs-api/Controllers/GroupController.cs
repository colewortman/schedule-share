using Microsoft.AspNetCore.Mvc;
using cs_api.Models;
using cs_api.Services;

namespace cs_api.Controllers;

[ApiController]
[Route("api/groups")]
public class GroupController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGroups()
    {
        try
        {
            var groups = await _groupService.GetAllGroups();
            return Ok(groups);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGroupById(string id)
    {
        try
        {
            var group = await _groupService.GetGroupById(id);
            if (group == null)
            {
                return NotFound(new { error = "Group not found" });
            }
            return Ok(group);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request)
    {
        try
        {
            var newGroup = await _groupService.CreateGroup(request.GroupName);
            return StatusCode(201, newGroup);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(string id, UpdateGroupRequest request)
    {
        try
        {
            var updatedGroup = await _groupService.UpdateGroup(id, request.GroupName);
            if (updatedGroup == null)
            {
                return NotFound(new { error = "Group not found" });
            }
            return Ok(updatedGroup);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(string id)
    {
        try
        {
            await _groupService.DeleteGroup(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal Server Error", detail = ex.Message });
        }
    }
}