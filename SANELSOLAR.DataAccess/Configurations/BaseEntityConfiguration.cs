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
    public static class BaseEntityConfiguration
    {
        public static void ConfigureBaseEntity<T>(this EntityTypeBuilder<T> builder) where T : BaseEntity
        {
            
            builder.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(e => e.UpdatedDate).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(e => e.IsActive).HasDefaultValue(true);
        }
    }
} 