using Microsoft.Extensions.Options;

namespace ReactWeaver.Server.Modules.Resources;

public sealed class ResourcesApiKeyHandler(IOptions<ResourcesServiceOptions> options) : DelegatingHandler
{
    private const string HeaderName = "X-Api-Key";

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        string apiKey = options.Value.ApiKey;
        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            request.Headers.Remove(HeaderName);
            request.Headers.Add(HeaderName, apiKey);
        }

        return base.SendAsync(request, cancellationToken);
    }
}
