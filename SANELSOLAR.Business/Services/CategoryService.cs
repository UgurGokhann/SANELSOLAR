using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace SANELSOLAR.Business.Services
{
    public class CategoryService : Service<CategoryCreateDto, CategoryUpdateDto, CategoryListDto, Category>, ICategoryService
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CategoryCreateDto> _createDtoValidator;
        private readonly IValidator<CategoryUpdateDto> _updateDtoValidator;

        public CategoryService(IMapper mapper,
                            IValidator<CategoryCreateDto> createDtoValidator,
                            IValidator<CategoryUpdateDto> updateDtoValidator,
                            IUow uow)
            : base(mapper, createDtoValidator, updateDtoValidator, uow)
        {
            _uow = uow;
            _mapper = mapper;
            _createDtoValidator = createDtoValidator;
            _updateDtoValidator = updateDtoValidator;
        }

        public async Task<IResponse<CategoryCreateDto>> CreateCategoryAsync(CategoryCreateDto dto)
        {
            try
            {
                var validationResult = _createDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var category = _mapper.Map<Category>(dto);
                    
                    // Veritabanına kaydedilecek entity'nin metin alanlarını büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(category.Name))
                        category.Name = category.Name.ToUpper();
                    
                    // Description alanı null olabilir, sadece dolu olduğunda büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(category.Description))
                        category.Description = category.Description.ToUpper();
                    
                    await _uow.GetRepository<Category>().CreateAsync(category);
                    await _uow.SaveChangesAsync();

                    return new Response<CategoryCreateDto>(ResponseType.Success, dto);
                }
                return new Response<CategoryCreateDto>(ResponseType.ValidationError, dto)
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
                return new Response<CategoryCreateDto>(ResponseType.Error, $"Kategori oluşturulurken bir hata meydana geldi: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        public async Task<IResponse<CategoryUpdateDto>> UpdateCategoryAsync(CategoryUpdateDto dto)
        {
            try
            {
                var validationResult = _updateDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var unchangedEntity = await _uow.GetRepository<Category>().FindAsync(dto.CategoryId);
                    if (unchangedEntity == null)
                    {
                        return new Response<CategoryUpdateDto>(ResponseType.NotFound, "Kategori bulunamadı");
                    }
                    
                    // "DIGER" kategorisinin güncellenmesini engelle
                    if (unchangedEntity.Name == "DIGER")
                    {
                        return new Response<CategoryUpdateDto>(ResponseType.Error, "DIGER kategorisi güncellenemez");
                    }

                    var entity = _mapper.Map<Category>(dto);
                    
                    // Veritabanına kaydedilecek entity'nin metin alanlarını büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(entity.Name))
                        entity.Name = entity.Name.ToUpper();
                    
                    // Description alanı null olabilir, sadece dolu olduğunda büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(entity.Description))
                        entity.Description = entity.Description.ToUpper();
                    
                    //entity.CategoryId = dto.CategoryId;
                    //entity.CreatedDate = unchangedEntity.CreatedDate;
                    //entity.CreatedUserId = unchangedEntity.CreatedUserId;
                    
                    _uow.GetRepository<Category>().Update(entity, unchangedEntity);
                    await _uow.SaveChangesAsync();

                    return new Response<CategoryUpdateDto>(ResponseType.Success, dto);
                }
                return new Response<CategoryUpdateDto>(ResponseType.ValidationError, dto)
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
                return new Response<CategoryUpdateDto>(ResponseType.Error, $"Kategori güncellenirken bir hata meydana geldi: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        public async Task<IResponse<List<CategoryListDto>>> GetCategoriesWithProductsAsync()
        {
            try
            {
                // Get all categories
                var categories = await _uow.GetRepository<Category>().GetAllAsync();
                
                if (categories == null || !categories.Any())
                {
                    return new Response<List<CategoryListDto>>(ResponseType.Success, new List<CategoryListDto>());
                }

                // Get all product categories
                var categoryIds = categories.Select(c => c.CategoryId).ToList();
                var productCategories = await _uow.GetRepository<ProductCategory>()
                    .GetAllAsync(pc => categoryIds.Contains(pc.CategoryId) && pc.IsActive);
                
                // Get all products related to these categories
                var productIds = productCategories.Select(pc => pc.ProductId).Distinct().ToList();
                var products = await _uow.GetRepository<Product>()
                    .GetAllAsync(p => productIds.Contains(p.ProductId) && p.IsActive);
                
                // Map categories to DTOs
                var categoryDtos = _mapper.Map<List<CategoryListDto>>(categories);
                
                // Her kategori için ürün sayısını hesapla
                await SetProductCountsForCategories(categoryDtos);
                
                return new Response<List<CategoryListDto>>(ResponseType.Success, categoryDtos);
            }
            catch (Exception ex)
            {
                return new Response<List<CategoryListDto>>(ResponseType.Error, $"Kategoriler getirilirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<List<CategoryListDto>>> SearchCategoriesAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    var allCategories = await _uow.GetRepository<Category>().GetAllAsync();

                    if (allCategories == null || !allCategories.Any())
                    {
                        return new Response<List<CategoryListDto>>(ResponseType.NotFound, "Kategori bulunamadı");
                    }

                    // Map categories to CategoryListDto
                    var allCategoryDtos = _mapper.Map<List<CategoryListDto>>(allCategories);
                    
                    // Her kategori için ürün sayısını hesapla
                    await SetProductCountsForCategories(allCategoryDtos);

                    return new Response<List<CategoryListDto>>(ResponseType.Success, allCategoryDtos);
                }

                // Convert search term to uppercase for case-insensitive search
                var upperSearchTerm = searchTerm.ToUpper();
                
                var categories = await _uow.GetRepository<Category>().GetAllAsync(
                    c => c.Name.Contains(upperSearchTerm) || c.Description.Contains(upperSearchTerm));

                if (categories == null || !categories.Any())
                {
                    return new Response<List<CategoryListDto>>(ResponseType.NotFound, $"'{searchTerm}' ile eşleşen kategori bulunamadı");
                }

                var categoryDtos = _mapper.Map<List<CategoryListDto>>(categories);
                
                // Her kategori için ürün sayısını hesapla
                await SetProductCountsForCategories(categoryDtos);

                return new Response<List<CategoryListDto>>(ResponseType.Success, categoryDtos);
            }
            catch (Exception ex)
            {
                return new Response<List<CategoryListDto>>(ResponseType.Error, $"Kategori arama sırasında bir hata meydana geldi: {ex.Message}");
            }
        }
        
        // Kategori DTO'ları için ürün sayılarını hesaplayan yardımcı metod
        private async Task SetProductCountsForCategories(List<CategoryListDto> categoryDtos)
        {
            if (categoryDtos == null || !categoryDtos.Any())
                return;
                
            // Tüm kategori ID'lerini al
            var categoryIds = categoryDtos.Select(c => c.CategoryId).ToList();
            
            // Bu kategorilere ait ürün-kategori ilişkilerini getir
            var productCategories = await _uow.GetRepository<ProductCategory>()
                .GetAllAsync(pc => categoryIds.Contains(pc.CategoryId) && pc.IsActive);
                
            // Her kategori için ürün sayısını hesapla
            foreach (var categoryDto in categoryDtos)
            {
                var count = productCategories.Count(pc => pc.CategoryId == categoryDto.CategoryId);
                categoryDto.ProductCount = count;
            }
        }
        
        public async Task<IResponse> RemoveCategoryAsync(int id, bool transferToDefault)
        {
            try
            {
                // Silinecek kategoriyi bul
                var categoryToDelete = await _uow.GetRepository<Category>().FindAsync(id);
                if (categoryToDelete == null)
                {
                    return new Response(ResponseType.NotFound, $"{id} nolu kategori bulunamadı");
                }
                
                // "DIGER" kategorisinin silinmesini engelle
                if (categoryToDelete.Name == "DIGER")
                {
                    return new Response(ResponseType.Error, "DIGER kategorisi silinemez");
                }
                
                // Eğer transferToDefault true ise, ürünleri "DIGER" kategorisine aktar
                if (transferToDefault)
                {
                    // Silinecek kategoriye ait ürün-kategori ilişkilerini bul
                    var productCategories = await _uow.GetRepository<ProductCategory>()
                        .GetAllAsync(pc => pc.CategoryId == id && pc.IsActive);
                    
                    // Eğer kategoriye ait ürünler varsa
                    if (productCategories.Any())
                    {
                        // "DIGER" kategorisini bul veya oluştur
                        var defaultCategory = await _uow.GetRepository<Category>()
                            .GetByFilterAsync(c => c.Name == "DIGER" && c.IsActive);
                        
                        // Eğer "DIGER" kategorisi yoksa, oluştur
                        if (defaultCategory == null)
                        {
                            defaultCategory = new Category
                            {
                                Name = "DIGER",
                                Description = "Diğer kategorilere ait olmayan ürünler",
                                IsActive = true,
                                CreatedDate = DateTime.Now,
                                CreatedUserId = 1 // Sistem kullanıcısı ID'si
                            };
                            
                            await _uow.GetRepository<Category>().CreateAsync(defaultCategory);
                            await _uow.SaveChangesAsync();
                        }
                        
                        // Ürünleri "DIGER" kategorisine aktar
                        foreach (var pc in productCategories)
                        {
                            // Ürünün zaten "DIGER" kategorisinde olup olmadığını kontrol et
                            var existingRelation = await _uow.GetRepository<ProductCategory>()
                                .GetByFilterAsync(x => x.ProductId == pc.ProductId && x.CategoryId == defaultCategory.CategoryId);
                            
                            // Eğer ürün zaten "DIGER" kategorisinde değilse, ekle
                            if (existingRelation == null)
                            {
                                var newProductCategory = new ProductCategory
                                {
                                    ProductId = pc.ProductId,
                                    CategoryId = defaultCategory.CategoryId,
                                    IsActive = true,
                                    CreatedDate = DateTime.Now,
                                    CreatedUserId = pc.CreatedUserId
                                };
                                
                                await _uow.GetRepository<ProductCategory>().CreateAsync(newProductCategory);
                            }
                        }
                        
                        // Değişiklikleri kaydet
                        await _uow.SaveChangesAsync();
                    }
                }
                
                // Kategoriyi sil
                _uow.GetRepository<Category>().Remove(categoryToDelete);
                await _uow.SaveChangesAsync();
                
                return new Response(ResponseType.Success, "Kategori başarıyla silindi");
            }
            catch (Exception ex)
            {
                return new Response(ResponseType.Error, $"Kategori silinirken bir hata oluştu: {ex.Message}");
            }
        }
    }
} 