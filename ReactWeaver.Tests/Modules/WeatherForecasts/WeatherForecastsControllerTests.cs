using System.Net;
using System.Net.Http.Json;
using Bogus;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

namespace ReactWeaver.Tests.Modules.WeatherForecasts;

[Collection("DefaultCollection")]
public class WeatherForecastsControllerTests : IAsyncLifetime
{
    private readonly HttpClient _client;
    private readonly IConfiguration _configuration;

    private readonly Faker<CreateWeatherForecastRequest> _createWeatherForecastFaker = new Faker<CreateWeatherForecastRequest>()
        .RuleFor(x => x.Date, faker => faker.Date.RecentDateOnly())
        .RuleFor(x => x.TemperatureC, faker => faker.Random.Int(-30, 50))
        .RuleFor(x => x.Summary, faker => faker.Lorem.Sentence());

    private readonly Faker<UpdateWeatherForecastRequest> _updateWeatherForecastFaker = new Faker<UpdateWeatherForecastRequest>()
        .RuleFor(x => x.Date, faker => faker.Date.SoonDateOnly())
        .RuleFor(x => x.TemperatureC, faker => faker.Random.Int(-30, 50))
        .RuleFor(x => x.Summary, faker => faker.Lorem.Sentence());

    public WeatherForecastsControllerTests(BaseFactory factory)
    {
        _client = factory.CreateClient();

        using IServiceScope scope = factory.Services.CreateScope();
        _configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    }

    public async Task InitializeAsync()
    {
        HttpResponseMessage response = await _client.PostAsJsonAsync("/api/auth/login?useCookies=true", new
        {
            email = _configuration["ADMIN_EMAIL"],
            password = _configuration["ADMIN_PASSWORD"]
        });

        response.EnsureSuccessStatusCode();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task GetWeatherForecasts_ReturnOK()
    {
        HttpResponseMessage response = await _client.GetAsync("/api/weather-forecasts");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        IEnumerable<WeatherForecastResponse>? forecasts = await response.Content.ReadFromJsonAsync<IEnumerable<WeatherForecastResponse>>();
        forecasts.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateWeatherForecast_ReturnCreated()
    {
        CreateWeatherForecastRequest request = _createWeatherForecastFaker.Generate();

        HttpResponseMessage response = await _client.PostAsJsonAsync("/api/weather-forecasts", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        WeatherForecastResponse? created = await response.Content.ReadFromJsonAsync<WeatherForecastResponse>();
        created.Should().NotBeNull();
        created.Summary.Should().Be(request.Summary);
    }

    [Fact]
    public async Task GetWeatherForecast_ReturnOK()
    {
        CreateWeatherForecastRequest request = _createWeatherForecastFaker.Generate();
        HttpResponseMessage postResponse = await _client.PostAsJsonAsync("/api/weather-forecasts", request);
        WeatherForecastResponse? created = await postResponse.Content.ReadFromJsonAsync<WeatherForecastResponse>();

        HttpResponseMessage getResponse = await _client.GetAsync($"/api/weather-forecasts/{created!.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        WeatherForecastResponse? fetched = await getResponse.Content.ReadFromJsonAsync<WeatherForecastResponse>();
        fetched.Should().NotBeNull();
        fetched.Id.Should().Be(created.Id);
    }

    [Fact]
    public async Task GetWeatherForecast_ReturnNotFound()
    {
        HttpResponseMessage response = await _client.GetAsync($"/api/weather-forecasts/wf_{Guid.CreateVersion7()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateWeatherForecast_ReturnOK()
    {
        CreateWeatherForecastRequest createRequest = _createWeatherForecastFaker.Generate();
        HttpResponseMessage createResponse = await _client.PostAsJsonAsync("/api/weather-forecasts", createRequest);
        WeatherForecastResponse? created = await createResponse.Content.ReadFromJsonAsync<WeatherForecastResponse>();

        UpdateWeatherForecastRequest updateRequest = _updateWeatherForecastFaker.Generate();

        HttpResponseMessage updateResponse = await _client.PutAsJsonAsync($"/api/weather-forecasts/{created!.Id}", updateRequest);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateWeatherForecast_ReturnNotFound()
    {
        UpdateWeatherForecastRequest updateRequest = _updateWeatherForecastFaker.Generate();
        HttpResponseMessage response = await _client.PutAsJsonAsync($"/api/weather-forecasts/wf_{Guid.CreateVersion7()}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteWeatherForecast_ReturnNoContent()
    {
        CreateWeatherForecastRequest request = _createWeatherForecastFaker.Generate();
        HttpResponseMessage postResponse = await _client.PostAsJsonAsync("/api/weather-forecasts", request);
        WeatherForecastResponse? created = await postResponse.Content.ReadFromJsonAsync<WeatherForecastResponse>();

        HttpResponseMessage deleteResponse = await _client.DeleteAsync($"/api/weather-forecasts/{created!.Id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        HttpResponseMessage getResponse = await _client.GetAsync($"/api/weather-forecasts/{created.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteWeatherForecast_ReturnNotFound()
    {
        HttpResponseMessage response = await _client.DeleteAsync($"/api/weather-forecasts/wf_{Guid.CreateVersion7()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
