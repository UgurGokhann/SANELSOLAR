using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using SANELSOLAR.Entities;
using System.Collections.Generic;

namespace SANELSOLAR.DataAccess.Configurations
{
    public class OfferTemplateConfiguration : IEntityTypeConfiguration<OfferTemplate>
    {
        public void Configure(EntityTypeBuilder<OfferTemplate> builder)
        {
            builder.ConfigureBaseEntity();
            builder.HasKey(x => x.TemplateId);
            
            builder.Property(t => t.Name).HasMaxLength(100).IsRequired();
            builder.Property(t => t.Description).HasMaxLength(500);
            builder.Property(t => t.IsDefault).HasDefaultValue(false);
            
            builder.Property(t => t.CompanyName).HasMaxLength(100);
            builder.Property(t => t.CompanyTagline).HasMaxLength(100);
            builder.Property(t => t.OfferTitle).HasMaxLength(100);
            builder.Property(t => t.OfferSubtitle).HasMaxLength(100);
            
            builder.Property(t => t.CustomerTitle).HasMaxLength(100);
            builder.Property(t => t.DeliveryTimeText).HasMaxLength(200);
            
            builder.Property(t => t.OfferInfoTitle).HasMaxLength(100);
            
            builder.Property(t => t.OfferNoteText).HasMaxLength(200);
            
            builder.Property(t => t.FooterCompanyName).HasMaxLength(100);
            builder.Property(t => t.FooterCompanyTagline).HasMaxLength(100);
            builder.Property(t => t.FooterAddress).HasMaxLength(200);
            builder.Property(t => t.FooterCity).HasMaxLength(100);
            builder.Property(t => t.FooterPhone).HasMaxLength(20);
            builder.Property(t => t.FooterTaxInfo).HasMaxLength(100);
            builder.Property(t => t.FooterWebsite).HasMaxLength(100);
            builder.Property(t => t.FooterEmail).HasMaxLength(100);
            
            builder.Property(t => t.PrimaryColor).HasMaxLength(20);
            builder.Property(t => t.SecondaryColor).HasMaxLength(20);
            builder.Property(t => t.HeaderBgColor).HasMaxLength(20);
            builder.Property(t => t.FooterBgColor).HasMaxLength(20);
            
            // Complex properties as JSON strings
            builder.Property(t => t.TermsAndConditions)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<string>>(v) ?? new List<string>()
                );
                
            builder.Property(t => t.Partners)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<PartnerInfo>>(v) ?? new List<PartnerInfo>()
                );
        }
    }
} 