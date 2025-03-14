using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class CategoryCreateDtoValidator : AbstractValidator<CategoryCreateDto>
    {
        public CategoryCreateDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Kategori adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Kategori adı en fazla 100 karakter olabilir");
            
            // Description alanı opsiyonel, sadece dolu olduğunda maksimum uzunluk kontrolü yapılıyor
            When(x => !string.IsNullOrEmpty(x.Description), () => {
                RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            });
            
            // Products alanının opsiyonel olduğunu belirtiyoruz
            //RuleFor(x => x.Products).Optional();
        }
    }

    public class CategoryUpdateDtoValidator : AbstractValidator<CategoryUpdateDto>
    {
        public CategoryUpdateDtoValidator()
        {
            RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Kategori ID boş olamaz");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Kategori adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Kategori adı en fazla 100 karakter olabilir");
            
            // Description alanı opsiyonel, sadece dolu olduğunda maksimum uzunluk kontrolü yapılıyor
            When(x => !string.IsNullOrEmpty(x.Description), () => {
                RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            });
        }
    }
} 