using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using ReactWeaver.Server.Modules.Localization.DTOs;

namespace ReactWeaver.Server.Modules.Localization;

[AllowAnonymous]
[ApiController]
[Route("api/culture")]
public sealed class CultureController : ControllerBase
{
    private static readonly HashSet<string> SupportedCultures =
    [
        "en",
        "fr",
    ];

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult SetCulture([FromBody] SetCultureRequest request)
    {
        string culture = request.Culture?.Trim() ?? "";

        if (string.IsNullOrWhiteSpace(culture))
        {
            return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Culture is required");
        }

        string normalizedCulture;

        try
        {
            var ci = CultureInfo.GetCultureInfo(culture);
            normalizedCulture = ci.TwoLetterISOLanguageName;
        }
        catch (CultureNotFoundException)
        {
            return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Unsupported culture");
        }

        if (!SupportedCultures.Contains(normalizedCulture))
        {
            return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Unsupported culture");
        }

        var requestCulture = new RequestCulture(normalizedCulture);

        string cookieValue = CookieRequestCultureProvider.MakeCookieValue(requestCulture);

        Response.Cookies.Append(
            CookieRequestCultureProvider.DefaultCookieName,
            cookieValue,
            new CookieOptions
            {
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddYears(1),
                IsEssential = true,
                SameSite = SameSiteMode.Lax,
                Secure = Request.IsHttps,
                HttpOnly = false,
            });

        return NoContent();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult ClearCulture()
    {
        Response.Cookies.Delete(CookieRequestCultureProvider.DefaultCookieName, new CookieOptions
        {
            Path = "/",
            SameSite = SameSiteMode.Lax,
            Secure = Request.IsHttps,
        });

        return NoContent();
    }
}
