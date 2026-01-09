using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactWeaver.Server.Database;
using ReactWeaver.Server.Modules.Auth;
using ReactWeaver.Server.Modules.Users;

namespace ReactWeaver.Server.Extensions;

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

        public async Task SeedInitialDataAsync()
        {
            using IServiceScope scope = app.Services.CreateScope();
            RoleManager<IdentityRole> roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            UserManager<User> userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            IConfiguration configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();


            try
            {
                if (!await roleManager.RoleExistsAsync(Roles.Member))
                {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Member));
                }

                if (!await roleManager.RoleExistsAsync(Roles.Admin))
                {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
                }

                app.Logger.LogInformation("successfully created roles.");

                string? adminEmail = configuration["Admin:Email"];
                string? adminPassword = configuration["Admin:Password"];

                if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
                {
                    return;
                }

                if (!await userManager.Users.AnyAsync(e => e.Email == adminEmail))
                {
                    var admin = new User
                    {
                        Id = $"u_${Guid.CreateVersion7()}",
                        Email = adminEmail,
                        UserName = adminEmail,
                        EmailConfirmed = true,
                    };

                    IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(admin, Roles.Admin);
                    }

                    app.Logger.LogInformation("successfully created admin user.");
                }

            }
            catch (Exception exception)
            {
                app.Logger.LogError(exception, "An error occurred while seeding initial data.");
                throw;
            }
        }
    }
}

