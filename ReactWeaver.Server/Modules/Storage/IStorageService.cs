namespace ReactWeaver.Server.Modules.Storage;

public interface IStorageService
{
    Task<string> UploadAsync(
        Stream stream,
        string key,
        string contentType,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task<string> GetDownloadUrlAsync(
        string key,
        TimeSpan? expires = null);
}
