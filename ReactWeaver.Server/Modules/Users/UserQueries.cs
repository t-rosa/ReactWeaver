using System.Linq.Expressions;
using ReactWeaver.Server.Modules.Users.DTOs;

namespace ReactWeaver.Server.Modules.Users;

internal static class UserQueries
{
    public static Expression<Func<User, UserResponse>> ProjectToResponse(IList<string> roles)
    {
        return user => new UserResponse
        {
            Id = user.Id,
            Email = user.Email ?? "",
            IsEmailConfirmed = user.EmailConfirmed,
            Roles = roles
        };
    }
}
