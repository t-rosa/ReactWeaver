using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using ReactWeaver.Server.Modules.Users;
using ReactWeaver.Server.Modules.Users.DTOs;

namespace ReactWeaver.Server.Modules.Auth;

[Authorize]
[ApiController]
[Route("api/auth")]
#pragma warning disable S6960 // Controllers should not have mixed responsibilities
public class AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IEmailSender<User> emailSender) : ControllerBase
#pragma warning restore S6960 // Controllers should not have mixed responsibilities
{
    private static readonly EmailAddressAttribute emailAddressAttribute = new();

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registration)
    {
        if (string.IsNullOrEmpty(registration.Email) || !emailAddressAttribute.IsValid(registration.Email))
        {
            return ValidationProblem();
        }

        var user = new User()
        {
            Id = $"u_{Guid.CreateVersion7()}"
        };

        await userManager.SetUserNameAsync(user, registration.Email);
        await userManager.SetEmailAsync(user, registration.Email);

        IdentityResult result = await userManager.CreateAsync(user, registration.Password);
        if (!result.Succeeded)
        {
            return ValidationProblem();
        }

        if (!await userManager.IsInRoleAsync(user, Roles.Member))
        {
            await userManager.AddToRoleAsync(user, Roles.Member);
        }

        try
        {
            await SendConfirmationEmailAsync(user, registration.Email);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed: {ex.Message}");
            throw;
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Login([FromBody] LoginRequest login, [FromQuery] bool? useCookies, [FromQuery] bool? useSessionCookies)
    {
        bool useCookieScheme = useCookies == true || useSessionCookies == true;
        bool isPersistent = useCookies == true && useSessionCookies != true;
        signInManager.AuthenticationScheme = useCookieScheme
            ? IdentityConstants.ApplicationScheme
            : IdentityConstants.BearerScheme;

        Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent, lockoutOnFailure: true);

        if (result.RequiresTwoFactor)
        {
            if (!string.IsNullOrEmpty(login.TwoFactorCode))
            {
                result = await signInManager.TwoFactorAuthenticatorSignInAsync(login.TwoFactorCode, isPersistent, isPersistent);
            }
            else if (!string.IsNullOrEmpty(login.TwoFactorRecoveryCode))
            {
                result = await signInManager.TwoFactorRecoveryCodeSignInAsync(login.TwoFactorRecoveryCode);
            }
        }

        if (!result.Succeeded)
        {
            return Unauthorized(result.ToString());
        }

        return NoContent();
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("confirmEmail")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string code, [FromQuery] string? changedEmail)
    {
        User? user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized();
        }

        try
        { code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)); }
        catch (FormatException) { return Unauthorized(); }

        IdentityResult result;
        if (string.IsNullOrEmpty(changedEmail))
        {
            result = await userManager.ConfirmEmailAsync(user, code);
        }
        else
        {
            result = await userManager.ChangeEmailAsync(user, changedEmail, code);
            if (result.Succeeded)
            {
                result = await userManager.SetUserNameAsync(user, changedEmail);
            }
        }

        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        return Redirect("/");
    }

    [AllowAnonymous]
    [HttpPost("resendConfirmationEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailRequest resendRequest)
    {
        User? user = await userManager.FindByEmailAsync(resendRequest.Email);
        if (user == null)
        {
            return Ok();
        }

        await SendConfirmationEmailAsync(user, resendRequest.Email);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("forgotPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest resetRequest)
    {
        User? user = await userManager.FindByEmailAsync(resetRequest.Email);
        if (user != null && await userManager.IsEmailConfirmedAsync(user))
        {
            string code = await userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            await emailSender.SendPasswordResetCodeAsync(user, resetRequest.Email, HtmlEncoder.Default.Encode(code));
        }
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("resetPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest resetRequest)
    {
        User? user = await userManager.FindByEmailAsync(resetRequest.Email);
        if (user == null || !await userManager.IsEmailConfirmedAsync(user))
        {
            return ValidationProblem();
        }

        IdentityResult result;
        try
        {
            string code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetRequest.ResetCode));
            result = await userManager.ResetPasswordAsync(user, code, resetRequest.NewPassword);
        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(userManager.ErrorDescriber.InvalidToken());
        }

        if (!result.Succeeded)
        {
            return ValidationProblem();
        }

        return Ok();
    }

    [HttpPost("info")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateInfo([FromBody] UpdateUserInfoRequest infoRequest)
    {
        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(infoRequest.NewEmail) && !emailAddressAttribute.IsValid(infoRequest.NewEmail))
        {
            return ValidationProblem();
        }

        if (!string.IsNullOrEmpty(infoRequest.NewPassword))
        {
            if (string.IsNullOrEmpty(infoRequest.OldPassword))
            {
                return ValidationProblem();
            }

            IdentityResult pwdResult = await userManager.ChangePasswordAsync(user, infoRequest.OldPassword, infoRequest.NewPassword);
            if (!pwdResult.Succeeded)
            {
                return ValidationProblem();
            }
        }

        if (!string.IsNullOrEmpty(infoRequest.NewEmail))
        {
            string? current = await userManager.GetEmailAsync(user);
            if (current != infoRequest.NewEmail)
            {
                await SendConfirmationEmailAsync(user, infoRequest.NewEmail, isChange: true);
            }
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

    private async Task SendConfirmationEmailAsync(User user, string email, bool isChange = false)
    {
        string code = isChange
            ? await userManager.GenerateChangeEmailTokenAsync(user, email)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);

        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        string userId = await userManager.GetUserIdAsync(user);

        string? url = Url.Action(nameof(ConfirmEmail), "Auth", new { userId, code, changedEmail = isChange ? email : null }, Request.Scheme);
        if (string.IsNullOrEmpty(url))
        {
            throw new InvalidOperationException("Failed to generate confirmation email URL.");
        }

        await emailSender.SendConfirmationLinkAsync(user, email, HtmlEncoder.Default.Encode(url));
    }
}
