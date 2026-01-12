using FluentValidation;

namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record CreateWeatherForecastRequest
{
    public required DateOnly Date { get; init; }
    public required int TemperatureC { get; init; }
    public string? Summary { get; init; }
}

public class CreateWeatherForecastRequestValidator : AbstractValidator<CreateWeatherForecastRequest>
{
    public CreateWeatherForecastRequestValidator()
    {
        RuleFor(e => e.Date).NotEmpty().WithMessage("The forecast date must be specified.");
        RuleFor(e => e.TemperatureC).NotEmpty().WithMessage("The forecast temperature must be specified.");
    }
}
