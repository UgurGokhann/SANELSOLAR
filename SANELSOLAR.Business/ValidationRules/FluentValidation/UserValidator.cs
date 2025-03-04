using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class UserLoginDtoValidator : AbstractValidator<UserLoginDto>
    {
        public UserLoginDtoValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Kullanıcı adı boş olamaz");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz");
        }
    }

    public class UserCreateDtoValidator : AbstractValidator<UserCreateDto>
    {
        public UserCreateDtoValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Kullanıcı adı boş olamaz");
            RuleFor(x => x.Username).MinimumLength(4).WithMessage("Kullanıcı adı en az 4 karakter olmalıdır");
            RuleFor(x => x.Username).MaximumLength(50).WithMessage("Kullanıcı adı en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz");
            RuleFor(x => x.Email).EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");
            
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz");
            RuleFor(x => x.Password).MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır");
            
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası boş olamaz");
            RuleFor(x => x.Phone).Matches(@"^\+?[0-9]{10,15}$").WithMessage("Geçerli bir telefon numarası giriniz");
            
            RuleFor(x => x.Address).MaximumLength(250).WithMessage("Adres en fazla 250 karakter olabilir");
            
            RuleFor(x => x.Role).NotEmpty().WithMessage("Kullanıcı rolü boş olamaz");
        }
    }

    public class UserUpdateDtoValidator : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("Kullanıcı ID boş olamaz");
            
            RuleFor(x => x.Username).NotEmpty().WithMessage("Kullanıcı adı boş olamaz");
            RuleFor(x => x.Username).MinimumLength(4).WithMessage("Kullanıcı adı en az 4 karakter olmalıdır");
            RuleFor(x => x.Username).MaximumLength(50).WithMessage("Kullanıcı adı en fazla 50 karakter olabilir");
            
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz");
            RuleFor(x => x.Email).EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");
            
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası boş olamaz");
            RuleFor(x => x.Phone).Matches(@"^\+?[0-9]{10,15}$").WithMessage("Geçerli bir telefon numarası giriniz");
            
            RuleFor(x => x.Address).MaximumLength(250).WithMessage("Adres en fazla 250 karakter olabilir");
            
            RuleFor(x => x.Role).NotEmpty().WithMessage("Kullanıcı rolü boş olamaz");
        }
    }

    public class UserPasswordUpdateDtoValidator : AbstractValidator<UserPasswordUpdateDto>
    {
        public UserPasswordUpdateDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("Kullanıcı ID boş olamaz");
            
            RuleFor(x => x.CurrentPassword).NotEmpty().WithMessage("Mevcut şifre boş olamaz");
            
            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("Yeni şifre boş olamaz");
            RuleFor(x => x.NewPassword).MinimumLength(6).WithMessage("Yeni şifre en az 6 karakter olmalıdır");
            RuleFor(x => x.NewPassword).NotEqual(x => x.CurrentPassword).WithMessage("Yeni şifre eski şifre ile aynı olamaz");
            
            RuleFor(x => x.ConfirmPassword).NotEmpty().WithMessage("Şifre onayı boş olamaz");
            RuleFor(x => x.ConfirmPassword).Equal(x => x.NewPassword).WithMessage("Şifreler eşleşmiyor");
        }
    }
} 