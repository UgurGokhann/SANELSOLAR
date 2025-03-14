using System;
using System.Collections.Generic;

namespace SANELSOLAR.DTOs
{
    public class CreateOfferDto : BaseDTO
    {
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public DateTime OfferDate { get; set; } 
        public DateTime ValidUntil { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public decimal TotalAmountUSD { get; set; }
        public decimal TotalAmountTRY { get; set; }
        public List<CreateOfferItemDto> OfferItems { get; set; }
    }

    public class UpdateOfferDto : BaseDTO
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
        public List<UpdateOfferItemDto> OfferItems { get; set; }
    }

    public class ListOfferDto : BaseDTO
    {
        public int OfferId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime OfferDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Notes { get; set; }
        public decimal TotalAmountUSD { get; set; }
        public decimal TotalAmountTRY { get; set; }
        public string Status { get; set; }
        public List<ListOfferItemDto> OfferItems { get; set; }
    }
} 