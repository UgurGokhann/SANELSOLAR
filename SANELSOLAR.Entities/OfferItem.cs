using System;

namespace SANELSOLAR.Entities
{
    public class OfferItem : BaseEntity
    {
        public int OfferItemId { get; set; }
        public int OfferId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
        public decimal TotalPriceUSD { get; set; }
        public decimal TotalPriceTRY { get; set; }

        // Navigation properties
        public Offer Offer { get; set; }
        public Product Product { get; set; }
    }
} 