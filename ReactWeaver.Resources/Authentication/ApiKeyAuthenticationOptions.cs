using Microsoft.AspNetCore.Authentication;

namespace ReactWeaver.Resources.Authentication;

public sealed class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
    public string HeaderName { get; set; } = ApiKeyAuthenticationDefaults.HeaderName;

    public IList<string> ApiKeys { get; } = [];
}
