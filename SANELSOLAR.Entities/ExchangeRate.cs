using System;

namespace SANELSOLAR.Entities
{
    public class ExchangeRate : BaseEntity
    {
        public DateTime Date { get; set; }
        public string FromCurrency { get; set; }
        public string ToCurrency { get; set; }
        public decimal Rate { get; set; }
    }
} 