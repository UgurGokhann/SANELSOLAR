using FluentValidation;
using SANELSOLAR.DTOs;
using System;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class ExchangeRateCreateDtoValidator : AbstractValidator<ExchangeRateCreateDto>
    {
        public ExchangeRateCreateDtoValidator()
        {
            RuleFor(x => x.Date).NotEmpty().WithMessage("Tarih boş olamaz");
            RuleFor(x => x.Date).LessThanOrEqualTo(DateTime.Now).WithMessage("Tarih bugünden ileri bir tarih olamaz");
            
            RuleFor(x => x.FromCurrency).NotEmpty().WithMessage("Kaynak para birimi boş olamaz");
            RuleFor(x => x.FromCurrency).MaximumLength(3).WithMessage("Kaynak para birimi en fazla 3 karakter olabilir");
            
            RuleFor(x => x.ToCurrency).NotEmpty().WithMessage("Hedef para birimi boş olamaz");
            RuleFor(x => x.ToCurrency).MaximumLength(3).WithMessage("Hedef para birimi en fazla 3 karakter olabilir");
            
            RuleFor(x => x.Rate).NotEmpty().WithMessage("Kur oranı boş olamaz");
            RuleFor(x => x.Rate).GreaterThan(0).WithMessage("Kur oranı 0'dan büyük olmalıdır");
        }
    }

    public class ExchangeRateUpdateDtoValidator : AbstractValidator<ExchangeRateUpdateDto>
    {
        public ExchangeRateUpdateDtoValidator()
        {
            RuleFor(x => x.ExchangeRateId).NotEmpty().WithMessage("Kur ID boş olamaz");
            
            RuleFor(x => x.Date).NotEmpty().WithMessage("Tarih boş olamaz");
            RuleFor(x => x.Date).LessThanOrEqualTo(DateTime.Now).WithMessage("Tarih bugünden ileri bir tarih olamaz");
            
            RuleFor(x => x.FromCurrency).NotEmpty().WithMessage("Kaynak para birimi boş olamaz");
            RuleFor(x => x.FromCurrency).MaximumLength(3).WithMessage("Kaynak para birimi en fazla 3 karakter olabilir");
            
            RuleFor(x => x.ToCurrency).NotEmpty().WithMessage("Hedef para birimi boş olamaz");
            RuleFor(x => x.ToCurrency).MaximumLength(3).WithMessage("Hedef para birimi en fazla 3 karakter olabilir");
            
            RuleFor(x => x.Rate).NotEmpty().WithMessage("Kur oranı boş olamaz");
            RuleFor(x => x.Rate).GreaterThan(0).WithMessage("Kur oranı 0'dan büyük olmalıdır");
        }
    }

    public class LatestExchangeRateRequestDtoValidator : AbstractValidator<LatestExchangeRateRequestDto>
    {
        public LatestExchangeRateRequestDtoValidator()
        {
            RuleFor(x => x.FromCurrency).NotEmpty().WithMessage("Kaynak para birimi boş olamaz");
            RuleFor(x => x.FromCurrency).MaximumLength(3).WithMessage("Kaynak para birimi en fazla 3 karakter olabilir");
            
            RuleFor(x => x.ToCurrency).NotEmpty().WithMessage("Hedef para birimi boş olamaz");
            RuleFor(x => x.ToCurrency).MaximumLength(3).WithMessage("Hedef para birimi en fazla 3 karakter olabilir");
        }
    }
} 