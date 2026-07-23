using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ReactWeaver.Resources.Modules.Resources;

public sealed class ResourceConfiguration : IEntityTypeConfiguration<Resource>
{
    public void Configure(EntityTypeBuilder<Resource> builder)
    {
        builder.HasKey(e => e.Id);

        builder
            .Property(e => e.Id)
            .HasMaxLength(500);

        builder
            .Property(e => e.FileName)
            .HasMaxLength(500);

        builder
            .Property(e => e.ContentType)
            .HasMaxLength(255);

        builder
            .Property(e => e.Extension)
            .HasMaxLength(50);

        builder
            .Property(e => e.Size);

        builder
            .Property(e => e.StorageKey)
            .HasMaxLength(1000);

        builder
            .Property(e => e.Checksum)
            .HasMaxLength(128);

        builder
            .Property(e => e.OwnerId)
            .HasMaxLength(500);

        builder
            .Property(e => e.Reference)
            .HasMaxLength(500);

        builder.HasIndex(e => e.OwnerId);

        builder.HasIndex(e => e.Reference);
    }
}
