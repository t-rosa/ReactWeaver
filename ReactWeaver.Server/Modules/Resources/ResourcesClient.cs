using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ReactWeaver.Server.Modules.Resources.DTOs;

namespace ReactWeaver.Server.Modules.Resources;

public sealed class ResourcesClient(HttpClient httpClient) : IResourcesClient
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task<IReadOnlyList<ResourceResponse>> GetResourcesAsync(
        string? ownerId = null,
        string? reference = null,
        CancellationToken cancellationToken = default)
    {
        var query = new List<string>();
        if (!string.IsNullOrWhiteSpace(ownerId))
        {
            query.Add($"ownerId={Uri.EscapeDataString(ownerId)}");
        }

        if (!string.IsNullOrWhiteSpace(reference))
        {
            query.Add($"reference={Uri.EscapeDataString(reference)}");
        }

        string requestUri = query.Count > 0
            ? $"api/resources?{string.Join('&', query)}"
            : "api/resources";

        List<ResourceResponse>? resources = await httpClient.GetFromJsonAsync<List<ResourceResponse>>(
            requestUri,
            SerializerOptions,
            cancellationToken);

        return resources ?? [];
    }

    public async Task<ResourceResponse?> GetResourceAsync(string id, CancellationToken cancellationToken = default)
    {
        using HttpResponseMessage response = await httpClient.GetAsync($"api/resources/{Uri.EscapeDataString(id)}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<ResourceResponse>(SerializerOptions, cancellationToken);
    }

    public async Task<ResourceContent?> DownloadResourceAsync(string id, CancellationToken cancellationToken = default)
    {
        HttpResponseMessage response = await httpClient.GetAsync(
            $"api/resources/{Uri.EscapeDataString(id)}/content",
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        try
        {
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                response.Dispose();
                return null;
            }

            response.EnsureSuccessStatusCode();

            Stream stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            string contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
            string fileName = response.Content.Headers.ContentDisposition?.FileNameStar
                ?? response.Content.Headers.ContentDisposition?.FileName
                ?? id;

            return new ResourceContent(stream, contentType, fileName.Trim('"'), response);
        }
        catch
        {
            response.Dispose();
            throw;
        }
    }

    public async Task<ResourceResponse> UploadResourceAsync(
        Stream content,
        string fileName,
        string contentType,
        string? ownerId = null,
        string? reference = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(content);

        using var form = new MultipartFormDataContent();

        // MultipartFormDataContent takes ownership of the added content instances and
        // disposes them when the form itself is disposed by the enclosing using statement.
#pragma warning disable CA2000
        var fileContent = new StreamContent(content);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(
            string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType);
        form.Add(fileContent, "File", fileName);

        if (!string.IsNullOrWhiteSpace(ownerId))
        {
            form.Add(new StringContent(ownerId), "OwnerId");
        }

        if (!string.IsNullOrWhiteSpace(reference))
        {
            form.Add(new StringContent(reference), "Reference");
        }
#pragma warning restore CA2000

        using HttpResponseMessage response = await httpClient.PostAsync("api/resources", form, cancellationToken);

        response.EnsureSuccessStatusCode();

        ResourceResponse? resource = await response.Content.ReadFromJsonAsync<ResourceResponse>(SerializerOptions, cancellationToken);

        return resource ?? throw new InvalidOperationException("The resources service returned an empty response.");
    }

    public async Task<bool> DeleteResourceAsync(string id, CancellationToken cancellationToken = default)
    {
        using HttpResponseMessage response = await httpClient.DeleteAsync($"api/resources/{Uri.EscapeDataString(id)}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }

        response.EnsureSuccessStatusCode();

        return true;
    }

    public async Task DeleteResourcesAsync(IReadOnlyCollection<string> ids, CancellationToken cancellationToken = default)
    {
        using HttpResponseMessage response = await httpClient.PostAsJsonAsync(
            "api/resources/bulk-delete",
            new { Ids = ids },
            SerializerOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();
    }
}
