using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IProductService : IService<ProductCreateDto, ProductUpdateDto, ProductListDto, Product>
    {
        Task<IResponse<ProductCreateDto>> CreateProductAsync(ProductCreateDto dto);
        Task<IResponse<ProductUpdateDto>> UpdateProductAsync(ProductUpdateDto dto);
        Task<IResponse<List<ProductListDto>>> GetProductsByCategoryAsync(int categoryId);
        Task<IResponse<ProductCreateDto>> UpdateProductCategoriesAsync(int productId, List<int> categoryIds);
        Task<IResponse<List<ProductListDto>>> GetAllProductsWithCategoriesAsync();
        Task<IResponse<ProductListDto>> GetProductByIdWithCategoriesAsync(int id);
        Task<IResponse<List<ProductListDto>>> SearchProductsWithCategoriesAsync(string searchTerm);
    }
} 