using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReactWeaver.Server.Modules.Localization.DTOs;
using ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

namespace ReactWeaver.Tests.Modules.Localization;

[Collection("DefaultCollection")]
public sealed class RequestLocalizationTests : IAsyncLifetime
{
    private const string EnglishIdsNotEmptyMessage = "At least one forecast ID must be provided.";
    private const string FrenchIdsNotEmptyMessage = "Au moins un identifiant de prévision doit être fourni.";

    private readonly HttpClient _client;
    private readonly IConfiguration _configuration;

    public RequestLocalizationTests(BaseFactory factory)
    {
        _client = factory.CreateClient(new() { HandleCookies = true });

        using IServiceScope scope = factory.Services.CreateScope();
        _configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    }

    public async Task InitializeAsync()
    {
        await _client.DeleteAsync("/api/culture");

        HttpResponseMessage response = await _client.PostAsJsonAsync("/api/auth/login?useCookies=true", new
        {
            email = _configuration["Admin:Email"],
            password = _configuration["Admin:Password"]
        });

        response.EnsureSuccessStatusCode();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task ValidationErrors_DefaultCulture_IsEnglish()
    {
        await _client.DeleteAsync("/api/culture");

        HttpResponseMessage response = await _client.PostAsJsonAsync(
            "/api/weather-forecasts/bulk-delete",
            new RemoveWeatherForecastsRequest { Ids = [] });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        string message = await ReadFirstValidationErrorAsync(response, "ids");
        message.Should().Be(EnglishIdsNotEmptyMessage);
    }

    [Fact]
    public async Task ValidationErrors_AcceptLanguageFrench_IsFrench()
    {
        await _client.DeleteAsync("/api/culture");

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/weather-forecasts/bulk-delete")
        {
            Content = JsonContent.Create(new RemoveWeatherForecastsRequest { Ids = [] })
        };

        request.Headers.TryAddWithoutValidation("Accept-Language", "fr-FR");

        HttpResponseMessage response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        string message = await ReadFirstValidationErrorAsync(response, "ids");
        message.Should().Be(FrenchIdsNotEmptyMessage);
    }

    [Fact]
    public async Task ValidationErrors_CultureCookie_OverridesAcceptLanguage()
    {
        await _client.DeleteAsync("/api/culture");

        HttpResponseMessage setCulture = await _client.PostAsJsonAsync(
            "/api/culture",
            new SetCultureRequest { Culture = "en" });
        setCulture.StatusCode.Should().Be(HttpStatusCode.NoContent);

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/weather-forecasts/bulk-delete")
        {
            Content = JsonContent.Create(new RemoveWeatherForecastsRequest { Ids = [] })
        };

        request.Headers.TryAddWithoutValidation("Accept-Language", "fr-FR");

        HttpResponseMessage response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        string message = await ReadFirstValidationErrorAsync(response, "ids");
        message.Should().Be(EnglishIdsNotEmptyMessage);
    }

    private static async Task<string> ReadFirstValidationErrorAsync(HttpResponseMessage response, string propertyName)
    {
        string json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        if (!doc.RootElement.TryGetProperty("errors", out JsonElement errors))
        {
            throw new InvalidOperationException("Expected ProblemDetails to contain an 'errors' extension.");
        }

        if (!errors.TryGetProperty(propertyName, out JsonElement propertyErrors) || propertyErrors.ValueKind != JsonValueKind.Array)
        {
            throw new InvalidOperationException($"Expected validation errors for '{propertyName}'.");
        }

        JsonElement first = propertyErrors.EnumerateArray().FirstOrDefault();
        string? message = first.GetString();

        return message ?? throw new InvalidOperationException($"Validation error for '{propertyName}' was null.");
    }
}
