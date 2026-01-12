using FluentValidation;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record RemoveWeatherForecastsRequest
{
    public required List<string> Ids { get; init; }
}

public class RemoveWeatherForecastsRequestValidator : AbstractValidator<RemoveWeatherForecastsRequest>
{
    public RemoveWeatherForecastsRequestValidator()
    {
        RuleFor(e => e.Ids).NotEmpty().WithMessage("At least one forecast ID must be provided.");
    }
}
