using SANELSOLAR.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IExchangeRateService
    {
        Task<List<ExchangeRateDto>> GetCurrentExchangeRatesAsync();
        Task<ExchangeRateDto> GetExchangeRateByCurrencyCodeAsync(string currencyCode);
    }
} 