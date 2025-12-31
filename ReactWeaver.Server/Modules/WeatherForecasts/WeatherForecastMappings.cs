using ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

namespace ReactWeaver.Server.Modules.WeatherForecasts;

internal static class WeatherForecastMappings
{
    extension(WeatherForecast forecast)
    {
        public WeatherForecastResponse ToResponse()
        {
            return new WeatherForecastResponse
            {
                Id = forecast.Id,
                Date = forecast.Date,
                TemperatureC = forecast.TemperatureC,
                Summary = forecast.Summary
            };
        }

        public void UpdateFromRequest(UpdateWeatherForecastRequest request, string userId)
        {
            forecast.UserId = userId;
            forecast.Date = request.Date;
            forecast.TemperatureC = request.TemperatureC;
            forecast.Summary = request.Summary;
            forecast.UpdatedAt = DateTime.UtcNow;
        }
    }

    extension(CreateWeatherForecastRequest request)
    {
        public WeatherForecast ToEntity(string userId)
        {
            return new WeatherForecast
            {
                Id = $"wf_{Guid.CreateVersion7()}",
                UserId = userId,
                Date = request.Date,
                TemperatureC = request.TemperatureC,
                Summary = request.Summary,
                CreatedAt = DateTime.UtcNow,
            };
        }
    }
}
