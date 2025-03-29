using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class CreateOfferTemplateValidator : AbstractValidator<CreateOfferTemplateDto>
    {
        public CreateOfferTemplateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Şablon adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Şablon adı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            
            RuleFor(x => x.CompanyName).MaximumLength(100).WithMessage("Şirket adı en fazla 100 karakter olabilir");
            RuleFor(x => x.CompanyTagline).MaximumLength(100).WithMessage("Şirket sloganı en fazla 100 karakter olabilir");
            RuleFor(x => x.OfferTitle).MaximumLength(100).WithMessage("Teklif başlığı en fazla 100 karakter olabilir");
            RuleFor(x => x.OfferSubtitle).MaximumLength(100).WithMessage("Teklif alt başlığı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.CustomerTitle).MaximumLength(100).WithMessage("Müşteri başlığı en fazla 100 karakter olabilir");
            RuleFor(x => x.DeliveryTimeText).MaximumLength(200).WithMessage("Teslimat süresi metni en fazla 200 karakter olabilir");
            
            RuleFor(x => x.OfferInfoTitle).MaximumLength(100).WithMessage("Teklif bilgileri başlığı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.OfferNoteText).MaximumLength(200).WithMessage("Teklif notu en fazla 200 karakter olabilir");
            
            RuleFor(x => x.FooterCompanyName).MaximumLength(100).WithMessage("Alt bilgi şirket adı en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterCompanyTagline).MaximumLength(100).WithMessage("Alt bilgi şirket sloganı en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterAddress).MaximumLength(200).WithMessage("Alt bilgi adresi en fazla 200 karakter olabilir");
            RuleFor(x => x.FooterCity).MaximumLength(100).WithMessage("Alt bilgi şehir bilgisi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterPhone).MaximumLength(20).WithMessage("Alt bilgi telefon numarası en fazla 20 karakter olabilir");
            RuleFor(x => x.FooterTaxInfo).MaximumLength(100).WithMessage("Alt bilgi vergi bilgisi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterWebsite).MaximumLength(100).WithMessage("Alt bilgi web sitesi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterEmail).MaximumLength(100).WithMessage("Alt bilgi e-posta adresi en fazla 100 karakter olabilir");
            
            RuleFor(x => x.PrimaryColor).MaximumLength(20).WithMessage("Ana renk en fazla 20 karakter olabilir");
            RuleFor(x => x.SecondaryColor).MaximumLength(20).WithMessage("İkincil renk en fazla 20 karakter olabilir");
            RuleFor(x => x.HeaderBgColor).MaximumLength(20).WithMessage("Başlık arka plan rengi en fazla 20 karakter olabilir");
            RuleFor(x => x.FooterBgColor).MaximumLength(20).WithMessage("Alt bilgi arka plan rengi en fazla 20 karakter olabilir");
        }
    }
    
    public class UpdateOfferTemplateValidator : AbstractValidator<UpdateOfferTemplateDto>
    {
        public UpdateOfferTemplateValidator()
        {
            RuleFor(x => x.TemplateId).NotEmpty().WithMessage("Şablon ID boş olamaz");
            
            RuleFor(x => x.Name).NotEmpty().WithMessage("Şablon adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Şablon adı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            
            RuleFor(x => x.CompanyName).MaximumLength(100).WithMessage("Şirket adı en fazla 100 karakter olabilir");
            RuleFor(x => x.CompanyTagline).MaximumLength(100).WithMessage("Şirket sloganı en fazla 100 karakter olabilir");
            RuleFor(x => x.OfferTitle).MaximumLength(100).WithMessage("Teklif başlığı en fazla 100 karakter olabilir");
            RuleFor(x => x.OfferSubtitle).MaximumLength(100).WithMessage("Teklif alt başlığı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.CustomerTitle).MaximumLength(100).WithMessage("Müşteri başlığı en fazla 100 karakter olabilir");
            RuleFor(x => x.DeliveryTimeText).MaximumLength(200).WithMessage("Teslimat süresi metni en fazla 200 karakter olabilir");
            
            RuleFor(x => x.OfferInfoTitle).MaximumLength(100).WithMessage("Teklif bilgileri başlığı en fazla 100 karakter olabilir");
            
            RuleFor(x => x.OfferNoteText).MaximumLength(200).WithMessage("Teklif notu en fazla 200 karakter olabilir");
            
            RuleFor(x => x.FooterCompanyName).MaximumLength(100).WithMessage("Alt bilgi şirket adı en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterCompanyTagline).MaximumLength(100).WithMessage("Alt bilgi şirket sloganı en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterAddress).MaximumLength(200).WithMessage("Alt bilgi adresi en fazla 200 karakter olabilir");
            RuleFor(x => x.FooterCity).MaximumLength(100).WithMessage("Alt bilgi şehir bilgisi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterPhone).MaximumLength(20).WithMessage("Alt bilgi telefon numarası en fazla 20 karakter olabilir");
            RuleFor(x => x.FooterTaxInfo).MaximumLength(100).WithMessage("Alt bilgi vergi bilgisi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterWebsite).MaximumLength(100).WithMessage("Alt bilgi web sitesi en fazla 100 karakter olabilir");
            RuleFor(x => x.FooterEmail).MaximumLength(100).WithMessage("Alt bilgi e-posta adresi en fazla 100 karakter olabilir");
            
            RuleFor(x => x.PrimaryColor).MaximumLength(20).WithMessage("Ana renk en fazla 20 karakter olabilir");
            RuleFor(x => x.SecondaryColor).MaximumLength(20).WithMessage("İkincil renk en fazla 20 karakter olabilir");
            RuleFor(x => x.HeaderBgColor).MaximumLength(20).WithMessage("Başlık arka plan rengi en fazla 20 karakter olabilir");
            RuleFor(x => x.FooterBgColor).MaximumLength(20).WithMessage("Alt bilgi arka plan rengi en fazla 20 karakter olabilir");
        }
    }
} 