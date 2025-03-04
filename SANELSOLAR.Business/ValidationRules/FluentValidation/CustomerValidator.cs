using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class CustomerCreateDtoValidator : AbstractValidator<CustomerCreateDto>
    {
        public CustomerCreateDtoValidator()
        {
            RuleFor(x => x.Firstname).NotEmpty().WithMessage("Ad boş olamaz");
            RuleFor(x => x.Firstname).MaximumLength(50).WithMessage("Ad en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Lastname).NotEmpty().WithMessage("Soyad boş olamaz");
            RuleFor(x => x.Lastname).MaximumLength(50).WithMessage("Soyad en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz");
            RuleFor(x => x.Email).EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");
            
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası boş olamaz");
            RuleFor(x => x.Phone).Matches(@"^\+?[0-9]{10,15}$").WithMessage("Geçerli bir telefon numarası giriniz");
            
            RuleFor(x => x.Address).MaximumLength(250).WithMessage("Adres en fazla 250 karakter olabilir");
        }
    }

    public class CustomerUpdateDtoValidator : AbstractValidator<CustomerUpdateDto>
    {
        public CustomerUpdateDtoValidator()
        {
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Müşteri ID boş olamaz");
            
            RuleFor(x => x.Firstname).NotEmpty().WithMessage("Ad boş olamaz");
            RuleFor(x => x.Firstname).MaximumLength(50).WithMessage("Ad en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Lastname).NotEmpty().WithMessage("Soyad boş olamaz");
            RuleFor(x => x.Lastname).MaximumLength(50).WithMessage("Soyad en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz");
            RuleFor(x => x.Email).EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");
            
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası boş olamaz");
            RuleFor(x => x.Phone).Matches(@"^\+?[0-9]{10,15}$").WithMessage("Geçerli bir telefon numarası giriniz");
            
            RuleFor(x => x.Address).MaximumLength(250).WithMessage("Adres en fazla 250 karakter olabilir");
        }
    }
} 