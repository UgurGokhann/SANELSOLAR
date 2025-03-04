using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SANELSOLAR.Entities;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class ExchangeRateConfiguration : IEntityTypeConfiguration<ExchangeRate>
    {
        public void Configure(EntityTypeBuilder<ExchangeRate> builder)
        {
            builder.ConfigureBaseEntity();
            builder.HasKey(x => new { x.Date, x.FromCurrency, x.ToCurrency });
            builder.Property(er => er.Rate).HasColumnType("decimal(18,6)").IsRequired();
        }
    }
}
