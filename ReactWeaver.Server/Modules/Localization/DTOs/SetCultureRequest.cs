namespace ReactWeaver.Server.Modules.Localization.DTOs;

public sealed record SetCultureRequest
{
    public required string Culture { get; init; }
}
