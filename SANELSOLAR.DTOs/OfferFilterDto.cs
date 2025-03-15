using System;

namespace SANELSOLAR.DTOs
{
    public class OfferFilterDto
    {
        public int? CustomerId { get; set; }
        public int? UserId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
    }
} 