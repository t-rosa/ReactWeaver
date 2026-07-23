using System.Linq.Expressions;
using ReactWeaver.Resources.Modules.Resources.DTOs;

namespace ReactWeaver.Resources.Modules.Resources;

internal static class ResourceQueries
{
    public static Expression<Func<Resource, ResourceResponse>> ProjectToResponse()
    {
        return resource => new ResourceResponse
        {
            Id = resource.Id,
            FileName = resource.FileName,
            ContentType = resource.ContentType,
            Extension = resource.Extension,
            Size = resource.Size,
            Checksum = resource.Checksum,
            OwnerId = resource.OwnerId,
            Reference = resource.Reference,
            CreatedAt = resource.CreatedAt,
            UpdatedAt = resource.UpdatedAt
        };
    }
}
