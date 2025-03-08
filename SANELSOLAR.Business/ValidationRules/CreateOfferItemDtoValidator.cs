using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules
{
    public class CreateOfferItemDtoValidator : AbstractValidator<CreateOfferItemDto>
    {
        public CreateOfferItemDtoValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün seçilmelidir.");
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("Miktar boş olamaz.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Miktar sıfırdan büyük olmalıdır.");
            RuleFor(x => x.UnitPriceUSD).NotEmpty().WithMessage("Birim fiyat boş olamaz.");
            RuleFor(x => x.UnitPriceUSD).GreaterThan(0).WithMessage("Birim fiyat sıfırdan büyük olmalıdır.");
        }
    }
} 