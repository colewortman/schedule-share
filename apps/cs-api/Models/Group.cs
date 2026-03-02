namespace cs_api.Models;

public class Group
{
    public required string GroupId { get; set; }
    public required string GroupName { get; set; }
}

public class CreateGroupRequest
{
    public required string GroupName { get; set; }
}

public class UpdateGroupRequest
{
    public required string? GroupName { get; set; }
}