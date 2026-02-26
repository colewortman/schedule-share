namespace cs_api.Models;

public class User
{
    public required string UserId { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
}

public class CreateUserRequest
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UpdateUserRequest
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
}
