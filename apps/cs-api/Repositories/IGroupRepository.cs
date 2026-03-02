using cs_api.Models;

namespace cs_api.Repositories;

public interface IGroupRepository
{
    Task<IEnumerable<Group>> GetAllGroups();
    Task<Group?> GetGroupById(string groupId);
    Task<Group> CreateGroup(string groupId, string groupName);
    Task<Group?> UpdateGroup(string groupId, string? groupName);
    Task DeleteUser(string groupId);
}