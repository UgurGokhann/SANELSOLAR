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

                    var entity = _mapper.Map<Category>(dto);
                    
                    // Veritabanına kaydedilecek entity'nin metin alanlarını büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(entity.Name))
                        entity.Name = entity.Name.ToUpper();
                    
                    // Description alanı null olabilir, sadece dolu olduğunda büyük harfe dönüştür
                    if (!string.IsNullOrEmpty(entity.Description))
                        entity.Description = entity.Description.ToUpper();
                    
                    entity.CategoryId = dto.CategoryId;
                    entity.CreatedDate = unchangedEntity.CreatedDate;
                    entity.CreatedUserId = unchangedEntity.CreatedUserId;
                    
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
                return new Response<List<CategoryListDto>>(ResponseType.Success, categoryDtos);
            }
            catch (Exception ex)
            {
                return new Response<List<CategoryListDto>>(ResponseType.Error, $"Kategoriler aranırken bir hata meydana geldi: {ex.Message}");
            }
        }

        
        
    }
} 