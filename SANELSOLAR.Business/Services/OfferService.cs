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
    public class OfferService : Service<CreateOfferDto, UpdateOfferDto, ListOfferDto, Offer>, IOfferService
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateOfferItemDto> _createOfferItemDtoValidator;
        private readonly IValidator<UpdateOfferItemDto> _updateOfferItemDtoValidator;

        public OfferService(
            IMapper mapper,
            IValidator<CreateOfferDto> createDtoValidator,
            IValidator<UpdateOfferDto> updateDtoValidator,
            IValidator<CreateOfferItemDto> createOfferItemDtoValidator,
            IValidator<UpdateOfferItemDto> updateOfferItemDtoValidator,
            IUow uow) : base(mapper, createDtoValidator, updateDtoValidator, uow)
        {
            _uow = uow;
            _mapper = mapper;
            _createOfferItemDtoValidator = createOfferItemDtoValidator;
            _updateOfferItemDtoValidator = updateOfferItemDtoValidator;
        }

        public async Task<IResponse<CreateOfferDto>> CreateAsync(CreateOfferDto dto)
        {
            // Validate offer items
            if (dto.OfferItems != null && dto.OfferItems.Any())
            {
                foreach (var item in dto.OfferItems)
                {
                    var itemValidationResult = _createOfferItemDtoValidator.Validate(item);
                    if (!itemValidationResult.IsValid)
                    {
                        return new Response<CreateOfferDto>(ResponseType.ValidationError, dto)
                        {
                            ValidationErrors = itemValidationResult.Errors.Select(x => new CustomValidationError
                            {
                                ErrorMessage = x.ErrorMessage,
                                PropertyName = x.PropertyName
                            }).ToList()
                        };
                    }
                }
            }

            // Create offer
            var offer = _mapper.Map<Offer>(dto);

            if (dto.TotalAmountUSD == 0 && dto.OfferItems != null && dto.OfferItems.Any())
            {
                decimal totalUSD = 0;
                foreach (var item in dto.OfferItems)
                {
                    var offerItem = _mapper.Map<OfferItem>(item);
                    offerItem.TotalPriceUSD = item.Quantity * item.UnitPriceUSD;
                    offerItem.TotalPriceTRY = offerItem.TotalPriceUSD * dto.ExchangeRate;
                    totalUSD += offerItem.TotalPriceUSD;
                }
                
                offer.TotalAmountUSD = totalUSD;
                offer.TotalAmountTRY = totalUSD * dto.ExchangeRate;
            }
            else
            {
                offer.TotalAmountUSD = dto.TotalAmountUSD;
                offer.TotalAmountTRY = dto.TotalAmountTRY;
            }

            await _uow.GetRepository<Offer>().CreateAsync(offer);
            await _uow.SaveChangesAsync();

            return new Response<CreateOfferDto>(ResponseType.Success, dto);
        }

        public async Task<IResponse<UpdateOfferDto>> UpdateAsync(UpdateOfferDto dto)
        {
            try
            {
                // Get existing offer
                var existingOffer = await _uow.GetRepository<Offer>().FindAsync(dto.OfferId);
                if (existingOffer == null)
                {
                    return new Response<UpdateOfferDto>(ResponseType.NotFound, $"Teklif bulunamadı. ID: {dto.OfferId}");
                }

                // Get existing offer items
                var existingOfferItems = await _uow.GetRepository<OfferItem>()
                    .GetQuery()
                    .Where(x => x.OfferId == dto.OfferId)
                    .ToListAsync();

                var updatedOffer = _mapper.Map<Offer>(dto);

                updatedOffer.TotalAmountUSD = dto.TotalAmountUSD;
                updatedOffer.TotalAmountTRY = dto.TotalAmountTRY;

                if (dto.TotalAmountUSD == 0 && dto.OfferItems != null && dto.OfferItems.Any())
                {
                    decimal totalUSD = 0;
                    
                    foreach (var item in dto.OfferItems)
                    {
                        decimal itemTotalUSD = item.Quantity * item.UnitPriceUSD;
                        totalUSD += itemTotalUSD;
                    }
                    
                    updatedOffer.TotalAmountUSD = totalUSD;
                    updatedOffer.TotalAmountTRY = totalUSD * dto.ExchangeRate;
                }

                // Handle offer items
                if (dto.OfferItems != null && dto.OfferItems.Any())
                {
                    var itemsToAdd = dto.OfferItems
                        .Where(x => x.OfferItemId == 0)
                        .ToList();

                    var itemsToUpdate = dto.OfferItems
                        .Where(x => x.OfferItemId > 0)
                        .ToList();

                    var itemsToDelete = existingOfferItems
                        .Where(x => !dto.OfferItems.Any(y => y.OfferItemId == x.OfferItemId))
                        .ToList();

                    // Process items to add
                    foreach (var item in itemsToAdd)
                    {
                        var createItemDto = new CreateOfferItemDto
                        {
                            OfferId = dto.OfferId,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPriceUSD = item.UnitPriceUSD
                        };
                        
                        var itemValidationResult = _createOfferItemDtoValidator.Validate(createItemDto);
                        if (!itemValidationResult.IsValid)
                        {
                            return new Response<UpdateOfferDto>(ResponseType.ValidationError, dto)
                            {
                                ValidationErrors = itemValidationResult.Errors.Select(x => new CustomValidationError
                                {
                                    ErrorMessage = x.ErrorMessage,
                                    PropertyName = x.PropertyName
                                }).ToList()
                            };
                        }

                        var offerItem = new OfferItem
                        {
                            OfferId = dto.OfferId,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPriceUSD = item.UnitPriceUSD,
                            TotalPriceUSD = item.Quantity * item.UnitPriceUSD,
                            TotalPriceTRY = (item.Quantity * item.UnitPriceUSD) * dto.ExchangeRate
                        };

                        await _uow.GetRepository<OfferItem>().CreateAsync(offerItem);
                    }

                    // Process items to update
                    foreach (var item in itemsToUpdate)
                    {
                        var itemValidationResult = _updateOfferItemDtoValidator.Validate(item);
                        if (!itemValidationResult.IsValid)
                        {
                            return new Response<UpdateOfferDto>(ResponseType.ValidationError, dto)
                            {
                                ValidationErrors = itemValidationResult.Errors.Select(x => new CustomValidationError
                                {
                                    ErrorMessage = x.ErrorMessage,
                                    PropertyName = x.PropertyName
                                }).ToList()
                            };
                        }

                        var existingItem = existingOfferItems.FirstOrDefault(x => x.OfferItemId == item.OfferItemId);
                        if (existingItem != null)
                        {
                            var updatedItem = new OfferItem
                            {
                                OfferItemId = item.OfferItemId,
                                OfferId = dto.OfferId,
                                ProductId = item.ProductId,
                                Quantity = item.Quantity,
                                UnitPriceUSD = item.UnitPriceUSD,
                                TotalPriceUSD = item.Quantity * item.UnitPriceUSD,
                                TotalPriceTRY = (item.Quantity * item.UnitPriceUSD) * dto.ExchangeRate
                            };

                            _uow.GetRepository<OfferItem>().Update(updatedItem, existingItem);
                        }
                    }

                    // Process items to delete
                    foreach (var item in itemsToDelete)
                    {
                        _uow.GetRepository<OfferItem>().Remove(item);
                    }
                }
                else
                {
                    // Remove all items if the list is empty
                    foreach (var item in existingOfferItems)
                    {
                        _uow.GetRepository<OfferItem>().Remove(item);
                    }
                }

                
                _uow.GetRepository<Offer>().Update(updatedOffer, existingOffer);
                await _uow.SaveChangesAsync();

                return new Response<UpdateOfferDto>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<UpdateOfferDto>(ResponseType.Error, $"Teklif güncellenirken bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<ListOfferDto>> GetOfferWithItemsAsync(int id)
        {
            var offer = await _uow.GetRepository<Offer>()
                .GetQuery()
                .Include(x => x.Customer)
                .Include(x => x.User)
                .Include(x => x.OfferItems)
                    .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.OfferId == id && x.IsActive);

            if (offer == null)
            {
                return new Response<ListOfferDto>(ResponseType.NotFound, $"Teklif bulunamadı. ID: {id}");
            }

            var dto = _mapper.Map<ListOfferDto>(offer);
            return new Response<ListOfferDto>(ResponseType.Success, dto);
        }

        public async Task<IResponse<List<ListOfferDto>>> GetOffersByCustomerAsync(int customerId)
        {
            var offers = await _uow.GetRepository<Offer>()
                .GetQuery()
                .Include(x => x.Customer)
                .Include(x => x.User)
                .Include(x => x.OfferItems)
                    .ThenInclude(x => x.Product)
                .Where(x => x.CustomerId == customerId && x.IsActive)
                .OrderByDescending(x => x.OfferDate)
                .ToListAsync();

            var dtos = _mapper.Map<List<ListOfferDto>>(offers);
            return new Response<List<ListOfferDto>>(ResponseType.Success, dtos);
        }

        public async Task<IResponse<List<ListOfferDto>>> GetOffersByUserAsync(int userId)
        {
            var offers = await _uow.GetRepository<Offer>()
                .GetQuery()
                .Include(x => x.Customer)
                .Include(x => x.User)
                .Include(x => x.OfferItems)
                    .ThenInclude(x => x.Product)
                .Where(x => x.UserId == userId && x.IsActive)
                .OrderByDescending(x => x.OfferDate)
                .ToListAsync();

            var dtos = _mapper.Map<List<ListOfferDto>>(offers);
            return new Response<List<ListOfferDto>>(ResponseType.Success, dtos);
        }

        public async Task<IResponse<List<ListOfferDto>>> GetOffersByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var offers = await _uow.GetRepository<Offer>()
                .GetQuery()
                .Include(x => x.Customer)
                .Include(x => x.User)
                .Include(x => x.OfferItems)
                    .ThenInclude(x => x.Product)
                .Where(x => x.OfferDate >= startDate && x.OfferDate <= endDate && x.IsActive)
                .OrderByDescending(x => x.OfferDate)
                .ToListAsync();

            var dtos = _mapper.Map<List<ListOfferDto>>(offers);
            return new Response<List<ListOfferDto>>(ResponseType.Success, dtos);
        }

        public async Task<IResponse<List<ListOfferDto>>> GetOffersByStatusAsync(string status)
        {
            var offers = await _uow.GetRepository<Offer>()
                .GetQuery()
                .Include(x => x.Customer)
                .Include(x => x.User)
                .Include(x => x.OfferItems)
                    .ThenInclude(x => x.Product)
                .Where(x => x.Status == status && x.IsActive)
                .OrderByDescending(x => x.OfferDate)
                .ToListAsync();

            var dtos = _mapper.Map<List<ListOfferDto>>(offers);
            return new Response<List<ListOfferDto>>(ResponseType.Success, dtos);
        }

        public async Task<IResponse> UpdateOfferStatusAsync(int offerId, string status)
        {
            try
            {
                var offer = await _uow.GetRepository<Offer>().FindAsync(offerId);
                if (offer == null)
                {
                    return new Response(ResponseType.NotFound, $"Teklif bulunamadı. ID: {offerId}");
                }

                var updatedOffer = new Offer
                {
                    OfferId = offer.OfferId,
                    CustomerId = offer.CustomerId,
                    UserId = offer.UserId,
                    OfferDate = offer.OfferDate,
                    ValidUntil = offer.ValidUntil,
                    ExchangeRate = offer.ExchangeRate,
                    Notes = offer.Notes,
                    TotalAmountUSD = offer.TotalAmountUSD,
                    TotalAmountTRY = offer.TotalAmountTRY,
                    Status = status,
                    CreatedDate = offer.CreatedDate,
                    CreatedUserId = offer.CreatedUserId,
                    IsActive = offer.IsActive
                };

                _uow.GetRepository<Offer>().Update(updatedOffer, offer);
                await _uow.SaveChangesAsync();

                return new Response(ResponseType.Success);
            }
            catch (Exception ex)
            {
                return new Response(ResponseType.Error, $"Durum güncelleme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<decimal>> CalculateTotalAmountAsync(int offerId)
        {
            try
            {
                var offer = await _uow.GetRepository<Offer>()
                    .GetQuery()
                    .Include(x => x.OfferItems)
                    .FirstOrDefaultAsync(x => x.OfferId == offerId);

                if (offer == null)
                {
                    return new Response<decimal>(ResponseType.NotFound, $"Teklif bulunamadı. ID: {offerId}");
                }

                decimal totalUSD = offer.OfferItems.Sum(x => x.TotalPriceUSD);
                decimal totalTRY = totalUSD * offer.ExchangeRate;

                var updatedOffer = new Offer
                {
                    OfferId = offer.OfferId,
                    CustomerId = offer.CustomerId,
                    UserId = offer.UserId,
                    OfferDate = offer.OfferDate,
                    ValidUntil = offer.ValidUntil,
                    ExchangeRate = offer.ExchangeRate,
                    Notes = offer.Notes,
                    TotalAmountUSD = totalUSD,
                    TotalAmountTRY = totalTRY,
                    Status = offer.Status,
                    CreatedDate = offer.CreatedDate,
                    CreatedUserId = offer.CreatedUserId,
                    IsActive = offer.IsActive
                };

                _uow.GetRepository<Offer>().Update(updatedOffer, offer);
                await _uow.SaveChangesAsync();

                return new Response<decimal>(ResponseType.Success, totalUSD);
            }
            catch (Exception ex)
            {
                return new Response<decimal>(ResponseType.Error, $"Toplam hesaplama sırasında bir hata oluştu: {ex.Message}");
            }
        }
    }
} 