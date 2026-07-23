using FluentValidation;

namespace ReactWeaver.Resources.Modules.Resources.DTOs;

public sealed record RemoveResourcesRequest
{
    public required IReadOnlyCollection<string> Ids { get; init; }
}

public sealed class RemoveResourcesRequestValidator : AbstractValidator<RemoveResourcesRequest>
{
    public RemoveResourcesRequestValidator()
    {
        RuleFor(e => e.Ids)
            .NotEmpty()
            .WithMessage("At least one resource id must be provided.");
    }
}
