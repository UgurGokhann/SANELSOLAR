using Microsoft.Extensions.Caching.Memory;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.DTOs;
using System.Globalization;
using System.Xml.Linq;

namespace SANELSOLAR.Business.Services
{
    public class ExchangeRateService : IExchangeRateService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        private const string CacheKey = "ExchangeRates";
        private const string TcmbUrl = "https://www.tcmb.gov.tr/kurlar/today.xml";
        private static readonly CultureInfo TurkishCulture = new CultureInfo("tr-TR");
        private const decimal RATE_DIVISOR = 10000m; // TCMB provides rates multiplied by 10000

        public ExchangeRateService(HttpClient httpClient, IMemoryCache memoryCache)
        {
            _httpClient = httpClient;
            _memoryCache = memoryCache;
        }

        public async Task<List<ExchangeRateDto>> GetCurrentExchangeRatesAsync()
        {
            if (_memoryCache.TryGetValue(CacheKey, out List<ExchangeRateDto> cachedRates))
            {
                return cachedRates;
            }

            try
            {
                var rates = await FetchExchangeRatesFromTcmbAsync();
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(GetNextUpdateTime());

                _memoryCache.Set(CacheKey, rates, cacheEntryOptions);
                return rates;
            }
            catch (Exception ex)
            {
                throw new Exception("TCMB'den döviz kuru verileri alınırken bir hata oluştu.", ex);
            }
        }

        public async Task<ExchangeRateDto> GetExchangeRateByCurrencyCodeAsync(string currencyCode)
        {
            var rates = await GetCurrentExchangeRatesAsync();
            return rates.FirstOrDefault(r => r.CurrencyCode.Equals(currencyCode, StringComparison.OrdinalIgnoreCase));
        }

        private async Task<List<ExchangeRateDto>> FetchExchangeRatesFromTcmbAsync()
        {
            var response = await _httpClient.GetStringAsync(TcmbUrl);
            var xmlDoc = XDocument.Parse(response);
            var rates = new List<ExchangeRateDto>();

            foreach (var currency in xmlDoc.Descendants("Currency"))
            {
                try
                {
                    rates.Add(new ExchangeRateDto
                    {
                        CurrencyCode = currency.Attribute("CurrencyCode")?.Value ?? string.Empty,
                        CurrencyName = currency.Element("CurrencyName")?.Value ?? string.Empty,
                        BuyingRate = ParseDecimal(currency.Element("ForexBuying")?.Value) / RATE_DIVISOR,
                        SellingRate = ParseDecimal(currency.Element("ForexSelling")?.Value) / RATE_DIVISOR,
                        EffectiveBuyingRate = ParseDecimal(currency.Element("BanknoteBuying")?.Value) / RATE_DIVISOR,
                        EffectiveSellingRate = ParseDecimal(currency.Element("BanknoteSelling")?.Value) / RATE_DIVISOR,
                        UpdateDate = DateTime.Now
                    });
                }
                catch (Exception ex)
                {
                    // Log the error but continue processing other currencies
                    Console.WriteLine($"Error parsing currency {currency.Attribute("CurrencyCode")?.Value}: {ex.Message}");
                }
            }

            if (!rates.Any())
            {
                throw new Exception("TCMB'den hiç geçerli döviz kuru verisi alınamadı.");
            }

            return rates;
        }

        private decimal ParseDecimal(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return 0;

            // Remove any non-breaking spaces and trim
            value = value.Replace("\u00A0", "").Trim();

            // Try parsing with Turkish culture (uses comma as decimal separator)
            if (decimal.TryParse(value, NumberStyles.Any, TurkishCulture, out decimal result))
                return result;

            // If Turkish culture fails, try with invariant culture (uses dot as decimal separator)
            if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out result))
                return result;

            // If both fail, return 0
            return 0;
        }

        private DateTime GetNextUpdateTime()
        {
            var now = DateTime.Now;
            var tomorrow = now.Date.AddDays(1).AddHours(15); // TCMB typically updates at 15:30 TR time
            return tomorrow;
        }
    }
} 