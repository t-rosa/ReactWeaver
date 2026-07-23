using Microsoft.EntityFrameworkCore;
using ReactWeaver.Resources.Database;

namespace ReactWeaver.Resources.Extensions;

public static class WebApplicationExtensions
{
    extension(WebApplication app)
    {
        public async Task ApplyMigrationAsync()
        {
            using IServiceScope scope = app.Services.CreateScope();
            ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                await db.Database.MigrateAsync();
                app.Logger.LogInformation("Database migrations applied successfully.");
            }
            catch (Exception e)
            {
                app.Logger.LogError(e, "An error occurred while applying database migrations.");
                throw;
            }
        }
    }
}
