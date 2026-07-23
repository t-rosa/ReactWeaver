using FluentValidation;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.OpenApi;
using ReactWeaver.Resources.Authentication;
using ReactWeaver.Resources.Database;
using ReactWeaver.Resources.Middlewares;
using ReactWeaver.Resources.Storage;

namespace ReactWeaver.Resources.Extensions;

public static class WebApplicationBuilderExtensions
{
    extension(WebApplicationBuilder builder)
    {
        public WebApplicationBuilder AddControllers()
        {
            builder.Services.AddControllers();

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
                            npgsqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Resources);
                        }
                    )
                    .UseSnakeCaseNamingConvention();
            });

            return builder;
        }

        public WebApplicationBuilder AddOpenApi()
        {
            builder.Services.AddOpenApi(options =>
            {
                options.AddOperationTransformer((operation, context, cancellationToken) =>
                {
                    operation.OperationId = context.Description.ActionDescriptor.RouteValues["action"];
                    return Task.CompletedTask;
                });

                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Components ??= new OpenApiComponents();
                    document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
                    document.Components.SecuritySchemes[ApiKeyAuthenticationDefaults.Scheme] = new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.ApiKey,
                        In = ParameterLocation.Header,
                        Name = ApiKeyAuthenticationDefaults.HeaderName,
                        Description = "Server-to-server API key required to access the resources service.",
                    };

                    return Task.CompletedTask;
                });
            });

            return builder;
        }

        public WebApplicationBuilder AddApiKeyAuthentication()
        {
            builder.Services
                .AddAuthentication(ApiKeyAuthenticationDefaults.Scheme)
                .AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(
                    ApiKeyAuthenticationDefaults.Scheme,
                    options =>
                    {
                        string[] keys = builder.Configuration.GetSection("ApiKey:Keys").Get<string[]>() ?? [];
                        foreach (string key in keys)
                        {
                            options.ApiKeys.Add(key);
                        }
                    });

            builder.Services.AddAuthorization();

            return builder;
        }

        public WebApplicationBuilder AddStorage()
        {
            builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection(StorageOptions.SectionName));

            builder.Services.AddSingleton<IFileStorage, LocalFileStorage>();

            StorageOptions storageOptions = builder.Configuration
                .GetSection(StorageOptions.SectionName)
                .Get<StorageOptions>() ?? new StorageOptions();

            long maxRequestBodySize = storageOptions.MaxFileSizeBytes + 1L * 1024 * 1024;

            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = storageOptions.MaxFileSizeBytes;
            });

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = maxRequestBodySize;
            });

            return builder;
        }

        public WebApplicationBuilder AddApplicationServices()
        {
            builder.Services.AddValidatorsFromAssemblyContaining<IProgram>();

            return builder;
        }
    }
}
