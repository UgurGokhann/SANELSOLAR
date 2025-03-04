using FluentValidation;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.Business.ValidationRules.FluentValidation
{
    public class ProductCreateDtoValidator : AbstractValidator<ProductCreateDto>
    {
        public ProductCreateDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Ürün adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Ürün adı en fazla 100 karakter olabilir");
            RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            RuleFor(x => x.PriceUSD).NotEmpty().WithMessage("Fiyat boş olamaz");
            RuleFor(x => x.PriceUSD).GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır");
            RuleFor(x => x.CategoryIds).NotEmpty().WithMessage("En az bir kategori seçilmelidir");
        }
    }

    public class ProductUpdateDtoValidator : AbstractValidator<ProductUpdateDto>
    {
        public ProductUpdateDtoValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün ID boş olamaz");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Ürün adı boş olamaz");
            RuleFor(x => x.Name).MaximumLength(100).WithMessage("Ürün adı en fazla 100 karakter olabilir");
            RuleFor(x => x.Description).MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
            RuleFor(x => x.PriceUSD).NotEmpty().WithMessage("Fiyat boş olamaz");
            RuleFor(x => x.PriceUSD).GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır");
            RuleFor(x => x.CategoryIds).NotEmpty().WithMessage("En az bir kategori seçilmelidir");
        }
    }
} 