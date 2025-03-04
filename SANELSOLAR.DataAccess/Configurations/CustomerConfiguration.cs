using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SANELSOLAR.Entities;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(x => x.CustomerId);
            builder.Property(c => c.Firstname).IsRequired().HasMaxLength(50);
            builder.Property(c => c.Lastname).IsRequired().HasMaxLength(50);
            builder.Property(c => c.Fullname).HasMaxLength(100);
            builder.Property(c => c.Email).IsRequired().HasMaxLength(100);
            builder.Property(c => c.Phone).HasMaxLength(20);
            builder.Property(c => c.Address).HasMaxLength(200);
        }
    }
}
