using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWeaver.Server.Database;
using ReactWeaver.Server.Modules.Auth;
using ReactWeaver.Server.Modules.Users.DTOs;

namespace ReactWeaver.Server.Modules.Users;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController(ApplicationDbContext db, UserManager<User> userManager) : ControllerBase
{
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser()
    {
        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var response = new UserResponse
        {
            Id = await userManager.GetUserIdAsync(user) ?? throw new NotSupportedException("Users must have an Id."),
            Email = await userManager.GetEmailAsync(user) ?? throw new NotSupportedException("Users must have an email."),
            Roles = await userManager.GetRolesAsync(user) ?? throw new NotSupportedException("Users must have a role."),
            IsEmailConfirmed = await userManager.IsEmailConfirmedAsync(user)
        };

        return Ok(response);
    }

    [HttpGet()]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IEnumerable<UserResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers()
    {
        List<User> users = await db.Users.AsNoTracking().ToListAsync();

        List<UserResponse> response = [];

        foreach (User user in users)
        {
            IList<string> roles = await userManager.GetRolesAsync(user);
            response.Add(user.ToResponse(roles));
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveUser([FromRoute] string id)
    {
        User? user = await db.Users
            .Where(e => e.Id == id)
            .SingleOrDefaultAsync();

        if (user is null)
        {
            return NotFound();
        }

        await userManager.DeleteAsync(user);

        return NoContent();
    }

    [HttpPost("bulk-delete")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RemoveUsers([FromBody] List<string> ids)
    {
        List<User> users = await db.Users
            .Where(e => ids.Contains(e.Id))
            .ToListAsync();

        if (users.Count == 0)
        {
            return NotFound();
        }

        foreach (User user in users)
        {
            await userManager.DeleteAsync(user);
        }

        return NoContent();
    }
}
