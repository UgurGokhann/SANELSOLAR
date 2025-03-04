using System;
using System.Collections.Generic;

namespace SANELSOLAR.DTOs
{
    // DTO for creating a new offer item
    public class OfferItemCreateDto : BaseDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
    }

    // DTO for updating an existing offer item
    public class OfferItemUpdateDto : UpdateDTO
    {
        public int OfferItemId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPriceUSD { get; set; }
    }

    // DTO for creating a new offer
    public class OfferCreateDto : BaseDTO
    {
        public int CustomerId { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Notes { get; set; }
        public List<OfferItemCreateDto> OfferItems { get; set; }
    }

    // DTO for updating an existing offer
    public class OfferUpdateDto : UpdateDTO
    {
        public int OfferId { get; set; }
        public int CustomerId { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
    }

    // DTO for updating offer status
    public class OfferStatusUpdateDto
    {
        public int OfferId { get; set; }
        public string Status { get; set; }
    }
} 