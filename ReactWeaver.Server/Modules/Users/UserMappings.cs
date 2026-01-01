using ReactWeaver.Server.Modules.Users.DTOs;

namespace ReactWeaver.Server.Modules.Users;

internal static class UsersMappings
{
    extension(User user)
    {
        public UserResponse ToResponse(IList<string> roles)
        {
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? "",
                IsEmailConfirmed = user.EmailConfirmed,
                Roles = roles
            };
        }
    }
}
