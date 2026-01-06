using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ReactWeaver.Server;
using ReactWeaver.Server.Database;
using Testcontainers.PostgreSql;

namespace ReactWeaver.Tests;

public class BaseFactory : WebApplicationFactory<IProgram>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder("postgres:18.1")
        .WithDatabase("react-weaver")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .WithPortBinding(5555, 5432)
        .WithWaitStrategy(Wait.ForUnixContainer())
        .Build();

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _container.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            ServiceDescriptor? descriptor = services.SingleOrDefault(s => s.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(_container.GetConnectionString())
                        .UseSnakeCaseNamingConvention());
        });

        base.ConfigureWebHost(builder);
    }
}
