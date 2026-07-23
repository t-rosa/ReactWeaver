using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace ReactWeaver.Resources.Authentication;

public sealed class ApiKeyAuthenticationHandler(
    IOptionsMonitor<ApiKeyAuthenticationOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder) : AuthenticationHandler<ApiKeyAuthenticationOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(Options.HeaderName, out StringValues headerValues))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        string? providedKey = headerValues.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(providedKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("Missing API key."));
        }

        if (!IsValidKey(providedKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));
        }

        Claim[] claims = [new Claim(ClaimTypes.Name, "resources-client")];
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }

    private bool IsValidKey(string providedKey)
    {
        byte[] providedBytes = Encoding.UTF8.GetBytes(providedKey);

        bool isValid = false;
        foreach (string key in Options.ApiKeys)
        {
            byte[] expectedBytes = Encoding.UTF8.GetBytes(key);
            if (CryptographicOperations.FixedTimeEquals(providedBytes, expectedBytes))
            {
                isValid = true;
            }
        }

        return isValid;
    }
}
