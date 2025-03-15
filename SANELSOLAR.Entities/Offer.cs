using System;
using System.Collections.Generic;

namespace SANELSOLAR.Entities
{
    public class Offer : BaseEntity
    {
        public int OfferId { get; set; }
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public DateTime OfferDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Notes { get; set; }
        public decimal TotalAmountUSD { get; set; }
        public decimal TotalAmountTRY { get; set; }
        public string Status { get; set; }
        public string ReferenceNumber { get; set; }

        // Navigation properties
        public Customer Customer { get; set; }
        public User User { get; set; }
        public ICollection<OfferItem> OfferItems { get; set; }
    }
} 