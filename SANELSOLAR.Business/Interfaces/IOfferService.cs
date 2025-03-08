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
        Task<IResponse<ListOfferDto>> GetOfferWithItemsAsync(int id);
        Task<IResponse<List<ListOfferDto>>> GetOffersByCustomerAsync(int customerId);
        Task<IResponse<List<ListOfferDto>>> GetOffersByUserAsync(int userId);
        Task<IResponse<List<ListOfferDto>>> GetOffersByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IResponse<List<ListOfferDto>>> GetOffersByStatusAsync(string status);
        Task<IResponse> UpdateOfferStatusAsync(int offerId, string status);
        Task<IResponse<decimal>> CalculateTotalAmountAsync(int offerId);
    }
} 