using Microsoft.AspNetCore.Identity;

namespace ReactWeaver.Server.Modules.Users;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Avatar { get; set; }
}
