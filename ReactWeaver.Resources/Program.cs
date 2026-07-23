using ReactWeaver.Resources.Extensions;
using Scalar.AspNetCore;

namespace ReactWeaver.Resources;

public interface IProgram
{
    private static async Task Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder
            .AddControllers()
            .AddErrorHandling()
            .AddDatabase()
            .AddOpenApi()
            .AddApiKeyAuthentication()
            .AddStorage()
            .AddApplicationServices();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();

            await app.ApplyMigrationAsync();
        }

        app.UseResponseCompression();

        app.UseHttpsRedirection();

        app.UseExceptionHandler();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}
