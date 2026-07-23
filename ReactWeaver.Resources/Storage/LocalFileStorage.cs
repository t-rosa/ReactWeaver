using Microsoft.Extensions.Options;

namespace ReactWeaver.Resources.Storage;

public sealed class LocalFileStorage : IFileStorage
{
    private readonly string _rootPath;

    public LocalFileStorage(IOptions<StorageOptions> options, IHostEnvironment environment)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(environment);

        string configuredPath = options.Value.RootPath;

        _rootPath = Path.IsPathRooted(configuredPath)
            ? Path.GetFullPath(configuredPath)
            : Path.GetFullPath(Path.Combine(environment.ContentRootPath, configuredPath));

        Directory.CreateDirectory(_rootPath);
    }

    public async Task SaveAsync(string storageKey, Stream content, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(content);

        string fullPath = ResolvePath(storageKey);

        string? directory = Path.GetDirectoryName(fullPath);
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await using FileStream fileStream = new(fullPath, FileMode.Create, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(fileStream, cancellationToken);
    }

    public Task<Stream?> OpenReadAsync(string storageKey, CancellationToken cancellationToken)
    {
        string fullPath = ResolvePath(storageKey);

        if (!File.Exists(fullPath))
        {
            return Task.FromResult<Stream?>(null);
        }

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult<Stream?>(stream);
    }

    public Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
    {
        string fullPath = ResolvePath(storageKey);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        return Task.CompletedTask;
    }

    private string ResolvePath(string storageKey)
    {
        if (string.IsNullOrWhiteSpace(storageKey))
        {
            throw new ArgumentException("Storage key must be provided.", nameof(storageKey));
        }

        string fullPath = Path.GetFullPath(Path.Combine(_rootPath, storageKey));

        string rootWithSeparator = _rootPath.EndsWith(Path.DirectorySeparatorChar)
            ? _rootPath
            : _rootPath + Path.DirectorySeparatorChar;

        if (!fullPath.StartsWith(rootWithSeparator, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("The resolved storage path is outside of the storage root.");
        }

        return fullPath;
    }
}
