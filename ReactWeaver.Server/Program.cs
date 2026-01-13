using ReactWeaver.Server.Extensions;
using Scalar.AspNetCore;

namespace ReactWeaver.Server;

public interface IProgram
{
    private static async Task Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder
            .AddControllers()
            .AddDatabase()
            .AddErrorHandling()
            .AddObservability()
            .AddAuthentication()
            .AddMailing()
            .AddApplicationServices();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();

            await app.ApplyMigrationAsync();
            await app.SeedInitialDataAsync();
        }

        app.UseResponseCompression();

        app.UseHttpsRedirection();

        app.UseExceptionHandler();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        await app.RunAsync();
    }
}
