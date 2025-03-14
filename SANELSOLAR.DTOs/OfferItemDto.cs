using System;

namespace SANELSOLAR.DTOs
{
    public class CreateOfferItemDto : BaseDTO
    {
        public int OfferId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
        public decimal TotalPriceUSD { get; set; }
        public decimal TotalPriceTRY { get; set; }
    }

    public class UpdateOfferItemDto : BaseDTO
    {
        public int OfferItemId { get; set; }
        public int OfferId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
        public decimal TotalPriceUSD { get; set; }
        public decimal TotalPriceTRY { get; set; }
    }

    public class ListOfferItemDto : BaseDTO
    {
        public int OfferItemId { get; set; }
        public int OfferId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
        public decimal TotalPriceUSD { get; set; }
        public decimal TotalPriceTRY { get; set; }
    }
} 