namespace ReactWeaver.Server.Modules.Resources.DTOs;

public sealed record ResourceResponse
{
    public required string Id { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required string Extension { get; init; }
    public required long Size { get; init; }
    public required string Checksum { get; init; }
    public string? OwnerId { get; init; }
    public string? Reference { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}
