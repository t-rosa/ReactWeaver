namespace ReactWeaver.Server.Modules.Users.DTOs;

public sealed record UpdateUserInfoRequest
{
    public required string NewEmail { get; init; }
    public required string NewPassword { get; init; }
    public required string OldPassword { get; init; }
}
