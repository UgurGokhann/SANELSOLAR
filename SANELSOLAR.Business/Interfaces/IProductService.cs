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
    public interface IProductService : IService<ProductCreateDto, ProductUpdateDto, ProductCreateDto, Product>
    {
        Task<IResponse<ProductCreateDto>> CreateProductAsync(ProductCreateDto dto);
        Task<IResponse<ProductUpdateDto>> UpdateProductAsync(ProductUpdateDto dto);
        Task<IResponse<List<ProductCreateDto>>> GetProductsByCategoryAsync(int categoryId);
        Task<IResponse<List<ProductCreateDto>>> SearchProductsAsync(string searchTerm);
        Task<IResponse<ProductCreateDto>> UpdateProductCategoriesAsync(int productId, List<int> categoryIds);
    }
} 