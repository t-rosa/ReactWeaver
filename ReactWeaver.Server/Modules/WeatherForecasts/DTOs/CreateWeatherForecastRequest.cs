using FluentValidation;
using Microsoft.Extensions.Localization;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record CreateWeatherForecastRequest
{
    public required DateOnly Date { get; init; }
    public required int TemperatureC { get; init; }
    public string? Summary { get; init; }
}

public class CreateWeatherForecastRequestValidator : AbstractValidator<CreateWeatherForecastRequest>
{
    public CreateWeatherForecastRequestValidator(IStringLocalizer<WeatherForecastsResource> localizer)
    {
        RuleFor(e => e.Date)
            .NotEmpty()
            .WithMessage(localizer["Validation_DateRequired"]);

        RuleFor(e => e.TemperatureC)
            .NotEmpty()
            .WithMessage(localizer["Validation_TemperatureRequired"]);
    }
}
