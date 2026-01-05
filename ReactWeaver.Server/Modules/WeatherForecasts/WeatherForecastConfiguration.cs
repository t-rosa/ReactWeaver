using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReactWeaver.Server.Modules.Users;

namespace ReactWeaver.Server.Modules.WeatherForecasts;

public sealed class WeatherForecastConfiguration : IEntityTypeConfiguration<WeatherForecast>
{
    public void Configure(EntityTypeBuilder<WeatherForecast> builder)
    {
        builder.HasKey(e => e.Id);

        builder
              .Property(e => e.Id)
              .HasMaxLength(500);

        builder
              .Property(e => e.UserId)
              .HasMaxLength(500);

        builder
              .Property(e => e.Date);

        builder
              .Property(e => e.TemperatureC);

        builder
              .Property(e => e.Summary)
              .HasMaxLength(100);

        builder
              .HasOne<User>()
              .WithMany()
              .HasForeignKey(e => e.UserId);
    }
}
