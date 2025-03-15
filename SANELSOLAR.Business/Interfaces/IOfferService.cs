using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IOfferService : IService<CreateOfferDto, UpdateOfferDto, ListOfferDto, Offer>
    {
        Task<IResponse<List<ListOfferDto>>> GetAllOffersAsync(OfferFilterDto filter = null);
        Task<IResponse<ListOfferDto>> GetOfferWithItemsAsync(int id);
        Task<IResponse> UpdateOfferStatusAsync(int offerId, string status);
        Task<IResponse<decimal>> CalculateTotalAmountAsync(int offerId);
    }
} 