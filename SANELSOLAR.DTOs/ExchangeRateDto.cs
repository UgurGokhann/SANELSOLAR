using System;

namespace SANELSOLAR.DTOs
{
    public class ExchangeRateDto
    {
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public decimal BuyingRate { get; set; }
        public decimal SellingRate { get; set; }
        public decimal EffectiveBuyingRate { get; set; }
        public decimal EffectiveSellingRate { get; set; }
        public DateTime UpdateDate { get; set; }
    }


} 