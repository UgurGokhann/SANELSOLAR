using System;
using System.Collections.Generic;

namespace SANELSOLAR.DTOs
{
    public class CreateOfferTemplateDto : BaseDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        
        // Header settings
        public string CompanyName { get; set; }
        public string CompanyTagline { get; set; }
        public string OfferTitle { get; set; }
        public string OfferSubtitle { get; set; }
        
        // Customer section settings
        public string CustomerTitle { get; set; }
        public bool ShowCustomerPhone { get; set; }
        public bool ShowCustomerAddress { get; set; }
        public string DeliveryTimeText { get; set; }
        
        // Offer info section settings
        public string OfferInfoTitle { get; set; }
        
        // Offer note
        public string OfferNoteText { get; set; }
        
        // Items table settings
        public bool ShowUnitPrices { get; set; }
        public bool ShowTotalPrices { get; set; }
        
        // Footer section settings
        public string FooterCompanyName { get; set; }
        public string FooterCompanyTagline { get; set; }
        public string FooterAddress { get; set; }
        public string FooterCity { get; set; }
        public string FooterPhone { get; set; }
        public string FooterTaxInfo { get; set; }
        public string FooterWebsite { get; set; }
        public string FooterEmail { get; set; }
        
        // Terms and conditions
        public List<string> TermsAndConditions { get; set; }
        
        // Partners section
        public List<PartnerInfoDto> Partners { get; set; }
        
        // Colors and styling
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public string HeaderBgColor { get; set; }
        public string FooterBgColor { get; set; }
    }
    
    public class UpdateOfferTemplateDto : BaseDTO
    {
        public int TemplateId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        
        // Header settings
        public string CompanyName { get; set; }
        public string CompanyTagline { get; set; }
        public string OfferTitle { get; set; }
        public string OfferSubtitle { get; set; }
        
        // Customer section settings
        public string CustomerTitle { get; set; }
        public bool ShowCustomerPhone { get; set; }
        public bool ShowCustomerAddress { get; set; }
        public string DeliveryTimeText { get; set; }
        
        // Offer info section settings
        public string OfferInfoTitle { get; set; }
        
        // Offer note
        public string OfferNoteText { get; set; }
        
        // Items table settings
        public bool ShowUnitPrices { get; set; }
        public bool ShowTotalPrices { get; set; }
        
        // Footer section settings
        public string FooterCompanyName { get; set; }
        public string FooterCompanyTagline { get; set; }
        public string FooterAddress { get; set; }
        public string FooterCity { get; set; }
        public string FooterPhone { get; set; }
        public string FooterTaxInfo { get; set; }
        public string FooterWebsite { get; set; }
        public string FooterEmail { get; set; }
        
        // Terms and conditions
        public List<string> TermsAndConditions { get; set; }
        
        // Partners section
        public List<PartnerInfoDto> Partners { get; set; }
        
        // Colors and styling
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public string HeaderBgColor { get; set; }
        public string FooterBgColor { get; set; }
    }
    
    public class ListOfferTemplateDto : BaseDTO
    {
        public int TemplateId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        
        // Header settings
        public string CompanyName { get; set; }
        public string CompanyTagline { get; set; }
        public string OfferTitle { get; set; }
        public string OfferSubtitle { get; set; }
        
        // Customer section settings
        public string CustomerTitle { get; set; }
        public bool ShowCustomerPhone { get; set; }
        public bool ShowCustomerAddress { get; set; }
        public string DeliveryTimeText { get; set; }
        
        // Offer info section settings
        public string OfferInfoTitle { get; set; }
        
        // Offer note
        public string OfferNoteText { get; set; }
        
        // Items table settings
        public bool ShowUnitPrices { get; set; }
        public bool ShowTotalPrices { get; set; }
        
        // Footer section settings
        public string FooterCompanyName { get; set; }
        public string FooterCompanyTagline { get; set; }
        public string FooterAddress { get; set; }
        public string FooterCity { get; set; }
        public string FooterPhone { get; set; }
        public string FooterTaxInfo { get; set; }
        public string FooterWebsite { get; set; }
        public string FooterEmail { get; set; }
        
        // Terms and conditions
        public List<string> TermsAndConditions { get; set; }
        
        // Partners section
        public List<PartnerInfoDto> Partners { get; set; }
        
        // Colors and styling
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public string HeaderBgColor { get; set; }
        public string FooterBgColor { get; set; }
    }
    
    public class PartnerInfoDto
    {
        public int PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string PartnerLogo { get; set; }
    }
} 