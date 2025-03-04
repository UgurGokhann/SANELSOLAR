using AutoMapper;
using FluentValidation;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Services
{
    public class ProductService : Service<ProductCreateDto, ProductUpdateDto, ProductCreateDto, Product>, IProductService
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
                                    CreatedUserId = unchangedEntity.CreatedUserId,
                                    UpdatedUserId = dto.UpdatedUserId,
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

        public async Task<IResponse<List<ProductCreateDto>>> GetProductsByCategoryAsync(int categoryId)
        {
            try
            {
                var productCategories = await _uow.GetRepository<ProductCategory>()
                    .GetAllAsync(x => x.CategoryId == categoryId && x.IsActive);
                
                if (productCategories == null || !productCategories.Any())
                {
                    return new Response<List<ProductCreateDto>>(ResponseType.NotFound, "Bu kategoriye ait ürün bulunamadı");
                }

                var productIds = productCategories.Select(x => x.ProductId).ToList();
                var products = await _uow.GetRepository<Product>()
                    .GetAllAsync(x => productIds.Contains(x.ProductId) && x.IsActive);
                
                var dtos = _mapper.Map<List<ProductCreateDto>>(products);
                return new Response<List<ProductCreateDto>>(ResponseType.Success, dtos);
            }
            catch (Exception ex)
            {
                return new Response<List<ProductCreateDto>>(ResponseType.Error, $"Kategoriye göre ürünler getirilirken bir hata meydana geldi: {ex.Message}");
            }
        }

        public async Task<IResponse<List<ProductCreateDto>>> SearchProductsAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return new Response<List<ProductCreateDto>>(ResponseType.ValidationError, "Arama terimi boş olamaz");
                }

                var normalizedSearchTerm = searchTerm.ToLower();
                var products = await _uow.GetRepository<Product>()
                    .GetAllAsync(x => (x.Name.ToLower().Contains(normalizedSearchTerm) ||
                                     x.Description.ToLower().Contains(normalizedSearchTerm)) &&
                                     x.IsActive);

                if (products == null || !products.Any())
                {
                    return new Response<List<ProductCreateDto>>(ResponseType.NotFound, "Arama kriterine uygun ürün bulunamadı");
                }

                var dtos = _mapper.Map<List<ProductCreateDto>>(products);
                return new Response<List<ProductCreateDto>>(ResponseType.Success, dtos);
            }
            catch (Exception ex)
            {
                return new Response<List<ProductCreateDto>>(ResponseType.Error, $"Ürün araması yapılırken bir hata meydana geldi: {ex.Message}");
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

                if (categoryIds == null || !categoryIds.Any())
                {
                    return new Response<ProductCreateDto>(ResponseType.ValidationError, "En az bir kategori seçilmelidir");
                }

                // Mevcut kategorileri kaldır
                var existingCategories = await _uow.GetRepository<ProductCategory>()
                    .GetAllAsync(x => x.ProductId == productId);
                
                foreach (var category in existingCategories)
                {
                    _uow.GetRepository<ProductCategory>().Remove(category);
                }
                
                // Yeni kategorileri ekle
                foreach (var categoryId in categoryIds)
                {
                    var productCategory = new ProductCategory
                    {
                        ProductId = productId,
                        CategoryId = categoryId,
                        CreatedUserId = product.CreatedUserId,
                        UpdatedUserId = product.UpdatedUserId,
                        IsActive = true
                    };
                    await _uow.GetRepository<ProductCategory>().CreateAsync(productCategory);
                }

                await _uow.SaveChangesAsync();
                
                var dto = _mapper.Map<ProductCreateDto>(product);
                dto.CategoryIds = categoryIds;
                
                return new Response<ProductCreateDto>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<ProductCreateDto>(ResponseType.Error, $"Ürün kategorileri güncellenirken bir hata meydana geldi: {ex.Message}");
            }
        }
    }
} 