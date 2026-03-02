using cs_api.Models;

namespace cs_api.Services;

public interface IGroupService
{
    Task<IEnumerable<Group>> GetAllGroups();
    Task<Group?> GetGroupById(string groupId);
    Task<Group> CreateGroup(string groupName);
    Task<Group?> UpdateGroup(string groupId, string? groupName);
    Task DeleteGroup(string groupId);
}