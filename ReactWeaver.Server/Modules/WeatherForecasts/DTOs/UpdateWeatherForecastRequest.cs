using FluentValidation;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record UpdateWeatherForecastRequest
{
    public required DateOnly Date { get; init; }
    public required int TemperatureC { get; init; }
    public string? Summary { get; init; }
}

public class UpdateWeatherForecastRequestValidator : AbstractValidator<UpdateWeatherForecastRequest>
{
    public UpdateWeatherForecastRequestValidator()
    {
        RuleFor(e => e.Date).NotEmpty().WithMessage("The forecast date must be specified.");

        RuleFor(e => e.TemperatureC)
            .InclusiveBetween(-100, 100)
            .WithMessage("The forecast temperature must be between -100 and 100.");
    }
}
