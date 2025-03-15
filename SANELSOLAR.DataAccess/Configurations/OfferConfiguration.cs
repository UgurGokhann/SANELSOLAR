using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SANELSOLAR.Entities;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class OfferConfiguration : IEntityTypeConfiguration<Offer>
    {
        public void Configure(EntityTypeBuilder<Offer> builder)
        {
            builder.ConfigureBaseEntity();
            builder.HasKey(x => x.OfferId);
            builder.Property(o => o.OfferDate).IsRequired();
            builder.Property(o => o.ValidUntil).IsRequired();
            builder.Property(o => o.ExchangeRate).HasColumnType("decimal(18,2)");
            builder.Property(o => o.Notes).HasMaxLength(500);
            builder.Property(o => o.TotalAmountUSD).HasColumnType("decimal(18,2)");
            builder.Property(o => o.TotalAmountTRY).HasColumnType("decimal(18,2)");
            builder.Property(o => o.Status).HasMaxLength(50);
            builder.Property(o => o.ReferenceNumber).HasMaxLength(20);

            builder.HasOne(o => o.Customer)
                   .WithMany(c => c.Offers)
                   .HasForeignKey(o => o.CustomerId);

            builder.HasOne(o => o.User)
                   .WithMany()
                   .HasForeignKey(o => o.UserId);
        }
    }
}
