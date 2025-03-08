using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules
{
    public class UpdateOfferItemDtoValidator : AbstractValidator<UpdateOfferItemDto>
    {
        public UpdateOfferItemDtoValidator()
        {
            RuleFor(x => x.OfferItemId).NotEmpty().WithMessage("Teklif kalemi ID boş olamaz.");
            RuleFor(x => x.OfferId).NotEmpty().WithMessage("Teklif ID boş olamaz.");
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün seçilmelidir.");
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("Miktar boş olamaz.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Miktar sıfırdan büyük olmalıdır.");
            RuleFor(x => x.UnitPriceUSD).NotEmpty().WithMessage("Birim fiyat boş olamaz.");
            RuleFor(x => x.UnitPriceUSD).GreaterThan(0).WithMessage("Birim fiyat sıfırdan büyük olmalıdır.");
            RuleFor(x => x.TotalPriceUSD).GreaterThanOrEqualTo(0).WithMessage("Toplam USD tutarı negatif olamaz.");
            RuleFor(x => x.TotalPriceTRY).GreaterThanOrEqualTo(0).WithMessage("Toplam TRY tutarı negatif olamaz.");
        }
    }
} 