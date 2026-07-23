namespace ReactWeaver.Server.Modules.Resources.DTOs;

public sealed class ResourceContent(Stream stream, string contentType, string fileName, IDisposable owner) : IDisposable
{
    public Stream Stream { get; } = stream;

    public string ContentType { get; } = contentType;

    public string FileName { get; } = fileName;

    public void Dispose()
    {
        Stream.Dispose();
        owner.Dispose();
    }
}
