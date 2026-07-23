namespace ReactWeaver.Server.Modules.Resources;

public sealed class ResourcesServiceOptions
{
    public const string SectionName = "ResourcesService";

    public string BaseUrl { get; set; } = string.Empty;

    public string ApiKey { get; set; } = string.Empty;
}
