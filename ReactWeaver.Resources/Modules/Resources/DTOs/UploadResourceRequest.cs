using FluentValidation;
using Microsoft.Extensions.Options;
using ReactWeaver.Resources.Storage;

namespace ReactWeaver.Resources.Modules.Resources.DTOs;

public sealed class UploadResourceRequest
{
    public required IFormFile File { get; init; }
    public string? OwnerId { get; init; }
    public string? Reference { get; init; }
}

public sealed class UploadResourceRequestValidator : AbstractValidator<UploadResourceRequest>
{
    public UploadResourceRequestValidator(IOptions<StorageOptions> storageOptions)
    {
        ArgumentNullException.ThrowIfNull(storageOptions);

        long maxFileSizeBytes = storageOptions.Value.MaxFileSizeBytes;

        RuleFor(e => e.File)
            .NotNull()
            .WithMessage("A file must be provided.");

        RuleFor(e => e.File.Length)
            .GreaterThan(0)
            .WithMessage("The file must not be empty.")
            .LessThanOrEqualTo(maxFileSizeBytes)
            .WithMessage($"The file must not exceed {maxFileSizeBytes} bytes.")
            .When(e => e.File is not null);

        RuleFor(e => e.OwnerId)
            .MaximumLength(500);

        RuleFor(e => e.Reference)
            .MaximumLength(500);
    }
}
