using cs_api.Models;
using cs_api.Repositories;

namespace cs_api.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groupRepository;

    public GroupService(IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task<IEnumerable<Group>> GetAllGroups()
    {
        return await _groupRepository.GetAllGroups();
    }

    public async Task<Group?> GetGroupById(string groupId)
    {
        return await _groupRepository.GetGroupById(groupId);
    }
    public async Task<Group> CreateGroup(string groupName)
    {
        var groupId = Guid.NewGuid().ToString();
        return await _groupRepository.CreateGroup(groupId, groupName);
    }
    public async Task<Group?> UpdateGroup(string groupId, string? groupName)
    {
        return await _groupRepository.UpdateGroup(groupId, groupName);
    }
    public async Task DeleteGroup(string groupId)
    {
        await _groupRepository.DeleteGroup(groupId);
    }
}