using ReactWeaver.Resources.Modules.Resources.DTOs;

namespace ReactWeaver.Resources.Modules.Resources;

internal static class ResourceMappings
{
    extension(Resource resource)
    {
        public ResourceResponse ToResponse()
        {
            return new ResourceResponse
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
}
