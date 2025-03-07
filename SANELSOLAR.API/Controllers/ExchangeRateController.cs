using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.DTOs;

namespace SANELSOLAR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExchangeRateController : ControllerBase
    {
        private readonly IExchangeRateService _exchangeRateService;

        public ExchangeRateController(IExchangeRateService exchangeRateService)
        {
            _exchangeRateService = exchangeRateService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExchangeRateDto>>> GetCurrentRates()
        {
            var rates = await _exchangeRateService.GetCurrentExchangeRatesAsync();
            return Ok(rates);
        }

        [HttpGet("{currencyCode}")]
        public async Task<ActionResult<ExchangeRateDto>> GetRateByCurrency(string currencyCode)
        {
            var rate = await _exchangeRateService.GetExchangeRateByCurrencyCodeAsync(currencyCode);
            if (rate == null)
                return NotFound($"Exchange rate for currency code {currencyCode} not found.");
            
            return Ok(rate);
        }
    }
} 