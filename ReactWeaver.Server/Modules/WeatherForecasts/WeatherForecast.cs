namespace ReactWeaver.Server.Modules.WeatherForecasts;

public sealed class WeatherForecast
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
    public required DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public required int TemperatureC { get; set; }
    public string? Summary { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

