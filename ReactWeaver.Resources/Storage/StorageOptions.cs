namespace ReactWeaver.Resources.Storage;

public sealed class StorageOptions
{
    public const string SectionName = "Storage";

    public string RootPath { get; set; } = "storage";

    public long MaxFileSizeBytes { get; set; } = 104_857_600;
}
