using FluentValidation;
using SANELSOLAR.DTOs;
using System;

namespace SANELSOLAR.Business.ValidationRules
{
    public class UpdateOfferDtoValidator : AbstractValidator<UpdateOfferDto>
    {
        public UpdateOfferDtoValidator()
        {
            RuleFor(x => x.OfferId).NotEmpty().WithMessage("Teklif ID boş olamaz.");
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Müşteri seçilmelidir.");
            RuleFor(x => x.UserId).NotEmpty().WithMessage("Kullanıcı seçilmelidir.");
            RuleFor(x => x.OfferDate).NotEmpty().WithMessage("Teklif tarihi boş olamaz.");
            RuleFor(x => x.ValidUntil).NotEmpty().WithMessage("Geçerlilik tarihi boş olamaz.");
            RuleFor(x => x.ValidUntil).GreaterThan(x => x.OfferDate).WithMessage("Geçerlilik tarihi teklif tarihinden sonra olmalıdır.");
            RuleFor(x => x.ExchangeRate).NotEmpty().WithMessage("Döviz kuru boş olamaz.");
            RuleFor(x => x.ExchangeRate).GreaterThan(0).WithMessage("Döviz kuru sıfırdan büyük olmalıdır.");
            RuleFor(x => x.TotalAmountUSD).GreaterThanOrEqualTo(0).WithMessage("Toplam USD tutarı negatif olamaz.");
            RuleFor(x => x.TotalAmountTRY).GreaterThanOrEqualTo(0).WithMessage("Toplam TRY tutarı negatif olamaz.");
            RuleFor(x => x.Status).NotEmpty().WithMessage("Durum boş olamaz.");
            RuleFor(x => x.OfferItems).NotEmpty().WithMessage("Teklif kalemleri boş olamaz.");
        }
    }
} 