namespace ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

public sealed record WeatherForecastResponse
{
    public required Guid Id { get; init; }
    public required DateOnly Date { get; init; }
    public required int TemperatureC { get; init; }
    public required string? Summary { get; init; }
}
