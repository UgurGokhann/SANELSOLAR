using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System.Linq;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductCreateDto>().ReverseMap();
            CreateMap<Product, ProductUpdateDto>().ReverseMap();
            
            // ProductListDto için özel mapping
            CreateMap<Product, ProductListDto>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => 
                    src.ProductCategories != null ? 
                    src.ProductCategories.Select(pc => new CategoryListDto 
                    { 
                        CategoryId = pc.CategoryId,
                        Name = pc.Category != null ? pc.Category.Name : null,
                        Description = pc.Category != null ? pc.Category.Description : null,
                        IsActive = pc.Category != null ? pc.Category.IsActive : false,
                        CreatedDate = pc.Category != null ? pc.Category.CreatedDate : default,
                        CreatedUserId = pc.Category != null ? pc.Category.CreatedUserId : default,
                        UpdatedDate = pc.Category != null ? pc.Category.UpdatedDate : default,
                        UpdatedUserId = pc.Category != null ? pc.Category.UpdatedUserId : default
                    }).ToList() : null));
        }
    }
} 