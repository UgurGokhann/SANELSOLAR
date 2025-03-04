using AutoMapper;
using FluentValidation;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Services
{
    public class Service<CreateDto, UpdateDto, ListDto, T> : IService<CreateDto, UpdateDto, ListDto, T>
        where CreateDto : class
        where UpdateDto : class
        where ListDto : class
        where T : class
    {
        private readonly IMapper _mapper;
        private readonly IValidator<CreateDto> _createDtoValidator;
        private readonly IValidator<UpdateDto> _updateDtoValidator;
        private readonly IUow _uow;

        public Service(IMapper mapper, IValidator<CreateDto> createDtoValidator, IValidator<UpdateDto> updateDtoValidator, IUow uow)
        {
            _mapper = mapper;
            _createDtoValidator = createDtoValidator;
            _updateDtoValidator = updateDtoValidator;
            _uow = uow;
        }

        public async Task<IResponse<CreateDto>> CreateAsync(CreateDto dto)
        {
            try
            {
                var validationResult = _createDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var entity = _mapper.Map<T>(dto);
                    await _uow.GetRepository<T>().CreateAsync(entity);
                    await _uow.SaveChangesAsync();
                    return new Response<CreateDto>(ResponseType.Success, dto);
                }
                return new Response<CreateDto>(ResponseType.ValidationError, dto)
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
                return new Response<CreateDto>(ResponseType.Error, $"Kayıt sırasında bir hata oluştu: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        public async Task<IResponse<List<ListDto>>> GetAllAsync()
        {
            try
            {
                var data = await _uow.GetRepository<T>().GetAllAsync();
                var dto = _mapper.Map<List<ListDto>>(data);
                return new Response<List<ListDto>>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<List<ListDto>>(ResponseType.Error, $"Veri çekme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<List<ListDto>>> GetAllAsync(Expression<Func<T, bool>> filter)
        {
            try
            {
                var data = await _uow.GetRepository<T>().GetAllAsync(filter);
                var dto = _mapper.Map<List<ListDto>>(data);
                return new Response<List<ListDto>>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<List<ListDto>>(ResponseType.Error, $"Veri çekme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<ListDto>> GetByIdAsync(int id)
        {
            try
            {
                var data = await _uow.GetRepository<T>().FindAsync(id);
                if (data != null)
                {
                    var dto = _mapper.Map<ListDto>(data);
                    return new Response<ListDto>(ResponseType.Success, dto);
                }
                return new Response<ListDto>(ResponseType.NotFound, $"{id} nolu veri bulunamadı");
            }
            catch (Exception ex)
            {
                return new Response<ListDto>(ResponseType.Error, $"Veri çekme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<IDto>> GetFilteredFirstOrDefaultAsync<IDto>(Expression<Func<T, bool>> filter)
        {
            try
            {
                var data = await _uow.GetRepository<T>().GetByFilterAsync(filter);
                if (data != null)
                {
                    var dto = _mapper.Map<IDto>(data);
                    return new Response<IDto>(ResponseType.Success, dto);
                }
                return new Response<IDto>(ResponseType.NotFound, "Veri bulunamadı");
            }
            catch (Exception ex)
            {
                return new Response<IDto>(ResponseType.Error, $"Veri çekme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse> RemoveAsync(int id)
        {
            try
            {
                var data = await _uow.GetRepository<T>().FindAsync(id);
                if (data != null)
                {
                    _uow.GetRepository<T>().Remove(data);
                    await _uow.SaveChangesAsync();
                    return new Response(ResponseType.Success, "Veri başarıyla silindi");
                }
                return new Response(ResponseType.NotFound, $"{id} nolu veri bulunamadı");
            }
            catch (Exception ex)
            {
                return new Response(ResponseType.Error, $"Silme işlemi sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<UpdateDto>> UpdateAsync(UpdateDto dto)
        {
            try
            {
                var validationResult = _updateDtoValidator.Validate(dto);
                if (validationResult.IsValid)
                {
                    var id = GetEntityIdFromDto(dto);
                    var unchangedData = await _uow.GetRepository<T>().FindAsync(id);
                    if (unchangedData != null)
                    {
                        var entity = _mapper.Map<T>(dto);
                        _uow.GetRepository<T>().Update(entity, unchangedData);
                        await _uow.SaveChangesAsync();
                        return new Response<UpdateDto>(ResponseType.Success, dto);
                    }
                    return new Response<UpdateDto>(ResponseType.NotFound, $"Güncellenecek veri bulunamadı");
                }
                return new Response<UpdateDto>(ResponseType.ValidationError, dto)
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
                return new Response<UpdateDto>(ResponseType.Error, $"Güncelleme sırasında bir hata oluştu: {ex.Message}")
                {
                    Data = dto
                };
            }
        }

        // Helper method to get ID from DTO
        private int GetEntityIdFromDto(UpdateDto dto)
        {
            try
            {
                var idProperty = dto.GetType().GetProperty("Id") ?? 
                                dto.GetType().GetProperty("CategoryId") ?? 
                                dto.GetType().GetProperty("ProductId") ?? 
                                dto.GetType().GetProperty("UserId") ?? 
                                dto.GetType().GetProperty("CustomerId") ?? 
                                dto.GetType().GetProperty("OfferId") ?? 
                                dto.GetType().GetProperty("ExchangeRateId");

                return idProperty != null ? (int)idProperty.GetValue(dto) : 0;
            }
            catch
            {
                return 0; // Default value if any exception occurs
            }
        }
    }
} 