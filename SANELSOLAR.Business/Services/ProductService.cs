using AutoMapper;
using FluentValidation;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SANELSOLAR.Business.Services
{
    public class ProductService : Service<ProductCreateDto, ProductUpdateDto, ProductListDto, Product>, IProductService
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<ProductCreateDto> _createDtoValidator;
        private readonly IValidator<ProductUpdateDto> _updateDtoValidator;
        public ProductService(IMapper mapper, 
                            IValidator<ProductCreateDto> createDtoValidator, 
                            IValidator<ProductUpdateDto> updateDtoValidator, 
                            IUow uow) 
            : base(mapper, createDtoValidator, updateDtoValidator, uow)
        {
            _uow = uow;
            _mapper = mapper;
            _createDtoValidator = createDtoValidator;
            _updateDtoValidator = updateDtoValidator;
        }

        public async Task<IResponse<ProductCreateDto>> CreateProductAsync(ProductCreateDto dto)
        {
            try
            {
                var validationResult = _createDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var product = _mapper.Map<Product>(dto);
                    
                    // Veritabanına kaydedilecek entity'nin metin alanlarını büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(product.Name))
                        product.Name = product.Name.ToUpper();
                    
                    if (!string.IsNullOrEmpty(product.Description))
                        product.Description = product.Description.ToUpper();
                    
                    await _uow.GetRepository<Product>().CreateAsync(product);
                    await _uow.SaveChangesAsync();

                    if (dto.CategoryIds != null && dto.CategoryIds.Count > 0)
                    {
                        foreach (var categoryId in dto.CategoryIds)
                        {
                            var productCategory = new ProductCategory
                            {
                                ProductId = product.ProductId,
                                CategoryId = categoryId,
                                CreatedUserId = dto.CreatedUserId,
                                IsActive = true
                            };
                            await _uow.GetRepository<ProductCategory>().CreateAsync(productCategory);
                        }
                        await _uow.SaveChangesAsync();
                    }

                    return new Response<ProductCreateDto>(ResponseType.Success, dto);
                }
                return new Response<ProductCreateDto>(ResponseType.ValidationError, dto)
                {
                    ValidationErrors = validationResult.Errors.Select(x => new CustomValidationError
                    {
                        ErrorMessage = x.ErrorMessage,
                        PropertyName = x.PropertyName
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                return new Response<ProductCreateDto>(ResponseType.Error, $"Ürün oluşturulurken bir hata meydana geldi: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        public async Task<IResponse<ProductUpdateDto>> UpdateProductAsync(ProductUpdateDto dto)
        {
            try
            {
                var validationResult = _updateDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var unchangedEntity = await _uow.GetRepository<Product>().FindAsync(dto.ProductId);
                    if (unchangedEntity != null)
                    {
                        var entity = _mapper.Map<Product>(dto);
                        
                        // Veritabanına kaydedilecek entity'nin metin alanlarını büyük harfe dönüştür
                        if (!string.IsNullOrEmpty(entity.Name))
                            entity.Name = entity.Name.ToUpper();
                        
                        if (!string.IsNullOrEmpty(entity.Description))
                            entity.Description = entity.Description.ToUpper();
                        
                        entity.ProductId = dto.ProductId;
                        entity.CreatedDate = unchangedEntity.CreatedDate;
                        entity.CreatedUserId = unchangedEntity.CreatedUserId;
                        
                        _uow.GetRepository<Product>().Update(entity, unchangedEntity);

                        // Kategorileri güncelle
                        var existingCategories = await _uow.GetRepository<ProductCategory>()
                            .GetAllAsync(x => x.ProductId == dto.ProductId);
                        
                        // Mevcut kategorileri kaldır
                        foreach (var category in existingCategories)
                        {
                            _uow.GetRepository<ProductCategory>().Remove(category);
                        }
                        
                        // Yeni kategorileri ekle
                        if (dto.CategoryIds != null && dto.CategoryIds.Count > 0)
                        {
                            foreach (var categoryId in dto.CategoryIds)
                            {
                                var productCategory = new ProductCategory
                                {
                                    ProductId = dto.ProductId,
                                    CategoryId = categoryId,
                                    CreatedUserId = dto.UpdatedUserId,
                                    IsActive = true
                                };
                                await _uow.GetRepository<ProductCategory>().CreateAsync(productCategory);
                            }
                        }
                        
                        await _uow.SaveChangesAsync();
                        return new Response<ProductUpdateDto>(ResponseType.Success, dto);
                    }
                    return new Response<ProductUpdateDto>(ResponseType.NotFound, "Ürün bulunamadı");
                }
                return new Response<ProductUpdateDto>(ResponseType.ValidationError, dto)
                {
                    ValidationErrors = validationResult.Errors.Select(x => new CustomValidationError
                    {
                        ErrorMessage = x.ErrorMessage,
                        PropertyName = x.PropertyName
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                return new Response<ProductUpdateDto>(ResponseType.Error, $"Ürün güncellenirken bir hata meydana geldi: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        public async Task<IResponse<List<ProductListDto>>> GetProductsByCategoryAsync(int categoryId)
        {
            try
            {
                // Kategoriye ait ürünleri ve tüm kategorilerini birlikte çekmek için özel sorgu
                var productCategories = await _uow.GetRepository<ProductCategory>()
                    .GetAllAsync(x => x.CategoryId == categoryId && x.IsActive);

                if (productCategories == null || !productCategories.Any())
                {
                    return new Response<List<ProductListDto>>(ResponseType.NotFound, "Bu kategoriye ait ürün bulunamadı");
                }

                var productIds = productCategories.Select(x => x.ProductId).ToList();

                var query = _uow.GetRepository<Product>().GetQuery();
                var productsWithCategories = await query
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .Where(p => productIds.Contains(p.ProductId) && p.IsActive)
                    .AsNoTracking()
                    .ToListAsync();

                if (productsWithCategories == null || !productsWithCategories.Any())
                {
                    return new Response<List<ProductListDto>>(ResponseType.NotFound, "Bu kategoriye ait ürün bulunamadı");
                }

                var dtos = _mapper.Map<List<ProductListDto>>(productsWithCategories);
                return new Response<List<ProductListDto>>(ResponseType.Success, dtos);
            }
            catch (Exception ex)
            {
                return new Response<List<ProductListDto>>(ResponseType.Error, $"Kategoriye göre ürünler getirilirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<ProductCreateDto>> UpdateProductCategoriesAsync(int productId, List<int> categoryIds)
        {
            try
            {
                var product = await _uow.GetRepository<Product>().FindAsync(productId);
                if (product == null)
                {
                    return new Response<ProductCreateDto>(ResponseType.NotFound, "Ürün bulunamadı");
                }

                // Mevcut kategorileri kaldır
                var existingCategories = await _uow.GetRepository<ProductCategory>()
                    .GetAllAsync(x => x.ProductId == productId);
                
                foreach (var category in existingCategories)
                {
                    _uow.GetRepository<ProductCategory>().Remove(category);
                }

                // Yeni kategorileri ekle
                if (categoryIds != null && categoryIds.Count > 0)
                {
                    foreach (var categoryId in categoryIds)
                    {
                        var productCategory = new ProductCategory
                        {
                            ProductId = productId,
                            CategoryId = categoryId,
                            CreatedUserId = product.CreatedUserId,
                            IsActive = true
                        };
                        await _uow.GetRepository<ProductCategory>().CreateAsync(productCategory);
                    }
                }

                await _uow.SaveChangesAsync();
                
                var dto = _mapper.Map<ProductCreateDto>(product);
                return new Response<ProductCreateDto>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<ProductCreateDto>(ResponseType.Error, $"Ürün kategorileri güncellenirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<List<ProductListDto>>> GetAllProductsWithCategoriesAsync()
        {
            try
            {
                // Ürünleri ve kategorilerini birlikte çekmek için özel sorgu
                var query = _uow.GetRepository<Product>().GetQuery();
                var productsWithCategories = await query
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .Where(p => p.IsActive)
                    .AsNoTracking()
                    .ToListAsync();

                if (productsWithCategories == null || !productsWithCategories.Any())
                {
                    return new Response<List<ProductListDto>>(ResponseType.NotFound, "Ürün bulunamadı");
                }

                var dtos = _mapper.Map<List<ProductListDto>>(productsWithCategories);
                return new Response<List<ProductListDto>>(ResponseType.Success, dtos);
            }
            catch (Exception ex)
            {
                return new Response<List<ProductListDto>>(ResponseType.Error, $"Ürünler listelenirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<ProductListDto>> GetProductByIdWithCategoriesAsync(int id)
        {
            try
            {
                // Ürünü ve kategorilerini birlikte çekmek için özel sorgu
                var query = _uow.GetRepository<Product>().GetQuery();
                var productWithCategories = await query
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .Where(p => p.ProductId == id && p.IsActive)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (productWithCategories == null)
                {
                    return new Response<ProductListDto>(ResponseType.NotFound, "Ürün bulunamadı");
                }

                var dto = _mapper.Map<ProductListDto>(productWithCategories);
                return new Response<ProductListDto>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<ProductListDto>(ResponseType.Error, $"Ürün getirilirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<List<ProductListDto>>> SearchProductsWithCategoriesAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return new Response<List<ProductListDto>>(ResponseType.ValidationError, "Arama terimi boş olamaz");
                }

                // Convert search term to uppercase for case-insensitive search
                var upperSearchTerm = searchTerm.ToUpper();
                
                var query = _uow.GetRepository<Product>().GetQuery();
                var productsWithCategories = await query
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .Where(p => (p.Name.Contains(upperSearchTerm) ||
                               p.Description.Contains(upperSearchTerm)) &&
                               p.IsActive)
                    .AsNoTracking()
                    .ToListAsync();

                if (productsWithCategories == null || !productsWithCategories.Any())
                {
                    return new Response<List<ProductListDto>>(ResponseType.NotFound, "Arama kriterine uygun ürün bulunamadı");
                }

                var dtos = _mapper.Map<List<ProductListDto>>(productsWithCategories);
                return new Response<List<ProductListDto>>(ResponseType.Success, dtos);
            }
            catch (Exception ex)
            {
                return new Response<List<ProductListDto>>(ResponseType.Error, $"Ürün araması yapılırken bir hata meydana geldi: {ex.Message}");
            }
        }
    }
} 