using System;

namespace SANELSOLAR.DTOs
{
    // DTO for creating a new exchange rate
    public class ExchangeRateCreateDto : BaseDTO
    {
        public DateTime Date { get; set; }
        public string FromCurrency { get; set; }
        public string ToCurrency { get; set; }
        public decimal Rate { get; set; }
    }

    // DTO for updating an existing exchange rate
    public class ExchangeRateUpdateDto : UpdateDTO
    {
        public int ExchangeRateId { get; set; }
        public DateTime Date { get; set; }
        public string FromCurrency { get; set; }
        public string ToCurrency { get; set; }
        public decimal Rate { get; set; }
    }

    // DTO for getting the latest exchange rate
    public class LatestExchangeRateRequestDto
    {
        public string FromCurrency { get; set; }
        public string ToCurrency { get; set; }
    }
} 