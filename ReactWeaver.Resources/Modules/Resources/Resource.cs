namespace ReactWeaver.Resources.Modules.Resources;

public sealed class Resource
{
    public required string Id { get; set; }
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public required string Extension { get; set; }
    public required long Size { get; set; }
    public required string StorageKey { get; set; }
    public required string Checksum { get; set; }
    public string? OwnerId { get; set; }
    public string? Reference { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
