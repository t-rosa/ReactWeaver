using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace ReactWeaver.Server.Modules.Storage;

public sealed class StorageService(
    IAmazonS3 s3,
    IOptions<StorageOptions> options)
    : IStorageService
{
    private readonly StorageOptions _options = options.Value;

    public async Task<string> UploadAsync(
        Stream stream,
        string key,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        await s3.PutObjectAsync(new PutObjectRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            InputStream = stream,
            ContentType = contentType
        }, cancellationToken);

        return key;
    }

    public Task DeleteAsync(
        string key,
        CancellationToken cancellationToken = default)
    {
        return s3.DeleteObjectAsync(
            _options.Bucket,
            key,
            cancellationToken);
    }

    public async Task<string> GetDownloadUrlAsync(
        string key,
        TimeSpan? expires = null)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            Expires = DateTime.UtcNow.Add(expires ?? TimeSpan.FromMinutes(15)),
            Protocol = Protocol.HTTP
        };

        string url = await s3.GetPreSignedURLAsync(request);

        return url;
    }
}
