using System.Globalization;
using FluentValidation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using ReactWeaver.Server.Database;
using ReactWeaver.Server.Extensions;
using ReactWeaver.Server.Middlewares;
using ReactWeaver.Server.Modules.Email;
using ReactWeaver.Server.Modules.Users;

namespace ReactWeaver.Server.Extensions;

public static class WebApplicationBuilderExtensions
{
    extension(WebApplicationBuilder builder)
    {
        public WebApplicationBuilder AddControllers()
        {
            builder.Services.AddControllers();

            builder.Services.AddOpenApi();

            builder.Services.AddResponseCompression();

            return builder;
        }

        public WebApplicationBuilder AddErrorHandling()
        {
            builder.Services.AddProblemDetails(options =>
            {
                options.CustomizeProblemDetails = context =>
                {
                    context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
                };
            });

            builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

            return builder;
        }

        public WebApplicationBuilder AddDatabase()
        {
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options
                    .UseNpgsql(
                        builder.Configuration["ConnectionStrings:Default"],
                        npgsqlOptions =>
                        {
                            npgsqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Application);
                        }
                    )
                    .UseSnakeCaseNamingConvention();
            });

            return builder;
        }

        public WebApplicationBuilder AddObservability()
        {
            builder.Services.AddOpenTelemetry()
                .ConfigureResource(resource => resource.AddService(builder.Environment.ApplicationName))
                .WithTracing(tracing => tracing
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation())
                .WithMetrics(metrics => metrics
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddRuntimeInstrumentation())
                .UseOtlpExporter();

            builder.Logging.AddOpenTelemetry(options =>
            {
                options.IncludeScopes = true;
                options.IncludeFormattedMessage = true;
            });

            return builder;
        }

        public WebApplicationBuilder AddI18n()
        {
            builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

            builder.Services.Configure<RequestLocalizationOptions>(options =>
            {
                CultureInfo[] supportedCultures =
                [
                    new CultureInfo("en"),
                    new CultureInfo("fr"),
                ];

                options.DefaultRequestCulture = new RequestCulture("en");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;

                options.RequestCultureProviders =
                [
                    new CookieRequestCultureProvider(),
                    new AcceptLanguageHeaderRequestCultureProvider(),
                ];
            });

            return builder;
        }

        public WebApplicationBuilder AddAuthentication()
        {
            builder.Services.AddAuthorization();

            builder.Services
                .AddIdentityApiEndpoints<User>(options =>
                {
                    options.SignIn.RequireConfirmedAccount = true;
                    options.SignIn.RequireConfirmedEmail = true;
                    options.User.RequireUniqueEmail = true;
                })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo("keys/storage"));

            return builder;
        }

        public WebApplicationBuilder AddMailing()
        {
            builder.Services.AddTransient<IEmailSender<User>, EmailSender>();
            builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("SmtpOptions"));

            return builder;
        }

        public WebApplicationBuilder AddApplicationServices()
        {
            builder.Services.AddValidatorsFromAssemblyContaining<IProgram>();

            builder.Services.AddHttpContextAccessor();

            return builder;
        }
    }
}
