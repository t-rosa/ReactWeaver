using ReactWeaver.Server.Modules.Resources.DTOs;

namespace ReactWeaver.Server.Modules.Resources;

public interface IResourcesClient
{
    Task<IReadOnlyList<ResourceResponse>> GetResourcesAsync(
        string? ownerId = null,
        string? reference = null,
        CancellationToken cancellationToken = default);

    Task<ResourceResponse?> GetResourceAsync(string id, CancellationToken cancellationToken = default);

    Task<ResourceContent?> DownloadResourceAsync(string id, CancellationToken cancellationToken = default);

    Task<ResourceResponse> UploadResourceAsync(
        Stream content,
        string fileName,
        string contentType,
        string? ownerId = null,
        string? reference = null,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteResourceAsync(string id, CancellationToken cancellationToken = default);

    Task DeleteResourcesAsync(IReadOnlyCollection<string> ids, CancellationToken cancellationToken = default);
}
