using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SANELSOLAR.Entities;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class OfferItemConfiguration : IEntityTypeConfiguration<OfferItem>
    {
        public void Configure(EntityTypeBuilder<OfferItem> builder)
        {
            builder.ConfigureBaseEntity();
            builder.HasKey(x => x.OfferItemId);
            builder.Property(oi => oi.Quantity).IsRequired();
            builder.Property(oi => oi.UnitPriceUSD).HasColumnType("decimal(18,2)");
            builder.Property(oi => oi.TotalPriceUSD).HasColumnType("decimal(18,2)");
            builder.Property(oi => oi.TotalPriceTRY).HasColumnType("decimal(18,2)");

            builder.HasOne(oi => oi.Offer)
                   .WithMany(o => o.OfferItems)
                   .HasForeignKey(oi => oi.OfferId);

            builder.HasOne(oi => oi.Product)
                   .WithMany(p => p.OfferItems)
                   .HasForeignKey(oi => oi.ProductId);
        }
    }
}
