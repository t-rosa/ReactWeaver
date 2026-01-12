using FluentValidation;
using Microsoft.Extensions.Localization;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record RemoveWeatherForecastsRequest
{
    public required List<string> Ids { get; init; }
}

public class RemoveWeatherForecastsRequestValidator : AbstractValidator<RemoveWeatherForecastsRequest>
{
    public RemoveWeatherForecastsRequestValidator(IStringLocalizer<WeatherForecastsResource> localizer)
    {
        RuleFor(e => e.Ids)
            .NotEmpty()
            .WithMessage(localizer["Validation_IdsNotEmpty"]);
    }
}
