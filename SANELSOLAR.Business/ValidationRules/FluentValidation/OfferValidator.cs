using FluentValidation;
using SANELSOLAR.DTOs;
using System;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class OfferItemCreateDtoValidator : AbstractValidator<CreateOfferItemDto>
    {
        public OfferItemCreateDtoValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün ID boş olamaz");
            
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("Miktar boş olamaz");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");
            
            RuleFor(x => x.UnitPriceUSD).NotEmpty().WithMessage("Birim fiyat boş olamaz");
            RuleFor(x => x.UnitPriceUSD).GreaterThan(0).WithMessage("Birim fiyat 0'dan büyük olmalıdır");
        }
    }

    public class OfferItemUpdateDtoValidator : AbstractValidator<UpdateOfferItemDto>
    {
        public OfferItemUpdateDtoValidator()
        {
            RuleFor(x => x.OfferItemId).NotEmpty().WithMessage("Teklif kalemi ID boş olamaz");
            
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün ID boş olamaz");
            
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("Miktar boş olamaz");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");
            
            RuleFor(x => x.UnitPriceUSD).NotEmpty().WithMessage("Birim fiyat boş olamaz");
            RuleFor(x => x.UnitPriceUSD).GreaterThan(0).WithMessage("Birim fiyat 0'dan büyük olmalıdır");
        }
    }

    public class OfferCreateDtoValidator : AbstractValidator<CreateOfferDto>
    {
        public OfferCreateDtoValidator()
        {
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Müşteri ID boş olamaz");
            
            RuleFor(x => x.ValidUntil).NotEmpty().WithMessage("Geçerlilik tarihi boş olamaz");
            RuleFor(x => x.ValidUntil).GreaterThan(DateTime.Now).WithMessage("Geçerlilik tarihi bugünden ileri bir tarih olmalıdır");
            
            RuleFor(x => x.ExchangeRate).NotEmpty().WithMessage("Döviz kuru boş olamaz");
            RuleFor(x => x.ExchangeRate).GreaterThan(0).WithMessage("Döviz kuru 0'dan büyük olmalıdır");
            
            RuleFor(x => x.Notes).MaximumLength(500).WithMessage("Notlar en fazla 500 karakter olabilir");
            
            RuleFor(x => x.OfferItems).NotEmpty().WithMessage("Teklif kalemleri boş olamaz");
            RuleForEach(x => x.OfferItems).SetValidator(new OfferItemCreateDtoValidator());
        }
    }

    public class OfferUpdateDtoValidator : AbstractValidator<UpdateOfferDto>
    {
        public OfferUpdateDtoValidator()
        {
            RuleFor(x => x.OfferId).NotEmpty().WithMessage("Teklif ID boş olamaz");
            
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Müşteri ID boş olamaz");
            
            RuleFor(x => x.ValidUntil).NotEmpty().WithMessage("Geçerlilik tarihi boş olamaz");
            RuleFor(x => x.ValidUntil).GreaterThan(DateTime.Now).WithMessage("Geçerlilik tarihi bugünden ileri bir tarih olmalıdır");
            
            RuleFor(x => x.ExchangeRate).NotEmpty().WithMessage("Döviz kuru boş olamaz");
            RuleFor(x => x.ExchangeRate).GreaterThan(0).WithMessage("Döviz kuru 0'dan büyük olmalıdır");
            
            RuleFor(x => x.Notes).MaximumLength(500).WithMessage("Notlar en fazla 500 karakter olabilir");
            
            RuleFor(x => x.Status).NotEmpty().WithMessage("Durum boş olamaz");
            RuleFor(x => x.Status).Must(status => new[] { "Bekliyor", "Onaylandı", "Reddedildi" }.Contains(status))
                .WithMessage("Durum değeri 'Bekliyor', 'Onaylandı' veya 'Reddedildi' olmalıdır");
        }
    }

    public class OfferStatusUpdateDtoValidator : AbstractValidator<ListOfferDto>
    {
        public OfferStatusUpdateDtoValidator()
        {
            RuleFor(x => x.OfferId).NotEmpty().WithMessage("Teklif ID boş olamaz");
            
            RuleFor(x => x.Status).NotEmpty().WithMessage("Durum boş olamaz");
            RuleFor(x => x.Status).Must(status => new[] { "Bekliyor", "Onaylandı", "Reddedildi" }.Contains(status))
                .WithMessage("Durum değeri 'Bekliyor', 'Onaylandı' veya 'Reddedildi' olmalıdır");
        }
    }
} 