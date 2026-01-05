using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWeaver.Server.Database;
using ReactWeaver.Server.Modules.Users;
using ReactWeaver.Server.Modules.WeatherForecasts.DTOs;

namespace ReactWeaver.Server.Modules.WeatherForecasts;

[Authorize()]
[ApiController]
[Route("api/weather-forecasts")]
public sealed class WeatherForecastsController(ApplicationDbContext db, UserManager<User> userManager) : ControllerBase
{
    [HttpGet()]
    [ProducesResponseType(typeof(IEnumerable<WeatherForecastResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetWeatherForecasts()
    {
        User? user = await userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        IQueryable<WeatherForecastResponse> response = db.WeatherForecasts
            .AsNoTracking()
            .Where(e => e.UserId == user.Id)
            .Select(WeatherForecastQueries.ProjectToResponse());

        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(WeatherForecastResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetWeatherForecast([FromRoute] string id)
    {
        User? user = await userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        IQueryable<WeatherForecastResponse> query = db.WeatherForecasts
            .Where(e => e.UserId == user.Id)
            .Where(e => e.Id == id)
            .Select(WeatherForecastQueries.ProjectToResponse());

        WeatherForecastResponse? response = await query.SingleOrDefaultAsync();
        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpPost()]
    [ProducesResponseType(typeof(WeatherForecastResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateWeatherForecast(
        [FromBody] CreateWeatherForecastRequest request,
        [FromServices] IValidator<CreateWeatherForecastRequest> validator)
    {
        await validator.ValidateAndThrowAsync(request);

        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        WeatherForecast forecast = request.ToEntity(user.Id);

        db.WeatherForecasts.Add(forecast);

        await db.SaveChangesAsync();

        WeatherForecastResponse response = forecast.ToResponse();

        return CreatedAtAction(nameof(GetWeatherForecast), new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateWeatherForecast(
        [FromRoute] string id,
        [FromBody] UpdateWeatherForecastRequest request,
        [FromServices] IValidator<UpdateWeatherForecastRequest> validator)
    {
        await validator.ValidateAndThrowAsync(request);

        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        WeatherForecast? forecast = await db.WeatherForecasts
            .Where(e => e.UserId == user.Id)
            .Where(e => e.Id == id)
            .SingleOrDefaultAsync();

        if (forecast is null)
        {
            return NotFound();
        }

        forecast.UpdateFromRequest(request, user.Id);

        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveWeatherForecast([FromRoute] string id)
    {
        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        WeatherForecast? forecast = await db.WeatherForecasts
            .Where(e => e.UserId == user.Id)
            .Where(e => e.Id == id)
            .SingleOrDefaultAsync();

        if (forecast is null)
        {
            return NotFound();
        }

        db.WeatherForecasts.Remove(forecast);

        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("bulk-delete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveWeatherForecasts([FromBody] List<string> ids)
    {
        User? user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        List<WeatherForecast> forecasts = await db.WeatherForecasts
            .Where(e => e.UserId == user.Id)
            .Where(e => ids.Contains(e.Id))
            .ToListAsync();

        if (forecasts.Count == 0)
        {
            return NotFound();
        }

        db.WeatherForecasts.RemoveRange(forecasts);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
