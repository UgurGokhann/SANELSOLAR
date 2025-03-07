using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ConfigureBaseEntity();
            builder.HasKey(x => x.ProductId);
            builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Description).HasMaxLength(100);
            builder.Property(x => x.PriceUSD)
                .IsRequired()
                .HasPrecision(18, 2);
            builder.Property(x => x.Quantity)
                .IsRequired()
                .HasDefaultValue(0);
            builder.Property(x => x.Unit)
                .IsRequired()
                .HasMaxLength(20);
            builder.Property(x => x.Brand)
                .IsRequired()
                .HasMaxLength(50);
            builder
                .HasMany(p => p.ProductCategories)
                .WithOne(pc => pc.Product)
                .HasForeignKey(pc => pc.ProductId);
        }
    }
}
