using FluentValidation;
using Microsoft.Extensions.Localization;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record UpdateWeatherForecastRequest
{
    public required DateOnly Date { get; init; }
    public required int TemperatureC { get; init; }
    public string? Summary { get; init; }
}

public class UpdateWeatherForecastRequestValidator : AbstractValidator<UpdateWeatherForecastRequest>
{
    public UpdateWeatherForecastRequestValidator(IStringLocalizer<WeatherForecastsResource> localizer)
    {
        RuleFor(e => e.Date)
            .NotEmpty()
            .WithMessage(localizer["Validation_DateRequired"]);

        RuleFor(e => e.TemperatureC)
            .NotEmpty()
            .WithMessage(localizer["Validation_TemperatureRequired"]);
    }
}
