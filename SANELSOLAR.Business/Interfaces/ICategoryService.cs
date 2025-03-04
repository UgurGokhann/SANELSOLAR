using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface ICategoryService : IService<CategoryCreateDto, CategoryUpdateDto, CategoryCreateDto, Category>
    {
        Task<IResponse<CategoryCreateDto>> CreateCategoryAsync(CategoryCreateDto dto);
        Task<IResponse<CategoryUpdateDto>> UpdateCategoryAsync(CategoryUpdateDto dto);
        Task<IResponse<List<CategoryCreateDto>>> GetCategoriesWithProductsAsync();
        Task<IResponse<List<CategoryCreateDto>>> SearchCategoriesAsync(string searchTerm);
    }
} 