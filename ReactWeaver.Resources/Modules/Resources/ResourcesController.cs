using System.Security.Cryptography;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWeaver.Resources.Database;
using ReactWeaver.Resources.Modules.Resources.DTOs;
using ReactWeaver.Resources.Storage;

namespace ReactWeaver.Resources.Modules.Resources;

[Authorize]
[ApiController]
[Route("api/resources")]
public sealed class ResourcesController(ApplicationDbContext db, IFileStorage storage) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ResourceResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetResources(
        [FromQuery] string? ownerId,
        [FromQuery] string? reference,
        CancellationToken cancellationToken)
    {
        List<ResourceResponse> response = await db.Resources
            .AsNoTracking()
            .Where(e => ownerId == null || e.OwnerId == ownerId)
            .Where(e => reference == null || e.Reference == reference)
            .OrderByDescending(e => e.CreatedAt)
            .Select(ResourceQueries.ProjectToResponse())
            .ToListAsync(cancellationToken);

        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ResourceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetResource([FromRoute] string id, CancellationToken cancellationToken)
    {
        ResourceResponse? response = await db.Resources
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(ResourceQueries.ProjectToResponse())
            .SingleOrDefaultAsync(cancellationToken);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpGet("{id}/content")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetResourceContent([FromRoute] string id, CancellationToken cancellationToken)
    {
        Resource? resource = await db.Resources
            .AsNoTracking()
            .SingleOrDefaultAsync(e => e.Id == id, cancellationToken);

        if (resource is null)
        {
            return NotFound();
        }

        Stream? stream = await storage.OpenReadAsync(resource.StorageKey, cancellationToken);
        if (stream is null)
        {
            return NotFound();
        }

        return File(stream, resource.ContentType, resource.FileName);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ResourceResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UploadResource(
        [FromForm] UploadResourceRequest request,
        [FromServices] IValidator<UploadResourceRequest> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        IFormFile file = request.File;

        string id = $"res_{Guid.CreateVersion7()}";
        string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        string storageKey = $"{id}{extension}";

        string checksum = await ComputeChecksumAsync(file, cancellationToken);

        await using (Stream uploadStream = file.OpenReadStream())
        {
            await storage.SaveAsync(storageKey, uploadStream, cancellationToken);
        }

        var resource = new Resource
        {
            Id = id,
            FileName = Path.GetFileName(file.FileName),
            ContentType = string.IsNullOrWhiteSpace(file.ContentType) ? "application/octet-stream" : file.ContentType,
            Extension = extension,
            Size = file.Length,
            StorageKey = storageKey,
            Checksum = checksum,
            OwnerId = request.OwnerId,
            Reference = request.Reference,
            CreatedAt = DateTime.UtcNow,
        };

        db.Resources.Add(resource);
        await db.SaveChangesAsync(cancellationToken);

        ResourceResponse response = resource.ToResponse();

        return CreatedAtAction(nameof(GetResource), new { id = response.Id }, response);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveResource([FromRoute] string id, CancellationToken cancellationToken)
    {
        Resource? resource = await db.Resources
            .SingleOrDefaultAsync(e => e.Id == id, cancellationToken);

        if (resource is null)
        {
            return NotFound();
        }

        await storage.DeleteAsync(resource.StorageKey, cancellationToken);

        db.Resources.Remove(resource);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("bulk-delete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveResources(
        [FromBody] RemoveResourcesRequest request,
        [FromServices] IValidator<RemoveResourcesRequest> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        List<Resource> resources = await db.Resources
            .Where(e => request.Ids.Contains(e.Id))
            .ToListAsync(cancellationToken);

        if (resources.Count == 0)
        {
            return NotFound();
        }

        foreach (Resource resource in resources)
        {
            await storage.DeleteAsync(resource.StorageKey, cancellationToken);
        }

        db.Resources.RemoveRange(resources);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static async Task<string> ComputeChecksumAsync(IFormFile file, CancellationToken cancellationToken)
    {
        await using Stream stream = file.OpenReadStream();
        byte[] hash = await SHA256.HashDataAsync(stream, cancellationToken);
        return Convert.ToHexStringLower(hash);
    }
}
