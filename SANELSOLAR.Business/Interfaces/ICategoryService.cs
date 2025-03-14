using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface ICategoryService : IService<CategoryCreateDto, CategoryUpdateDto, CategoryListDto, Category>
    {
        Task<IResponse<CategoryCreateDto>> CreateCategoryAsync(CategoryCreateDto dto);
        Task<IResponse<CategoryUpdateDto>> UpdateCategoryAsync(CategoryUpdateDto dto);
        Task<IResponse<List<CategoryListDto>>> GetCategoriesWithProductsAsync();
        Task<IResponse<List<CategoryListDto>>> SearchCategoriesAsync(string searchTerm);
        Task<IResponse> RemoveCategoryAsync(int id, bool transferToDefault);
    }
} 