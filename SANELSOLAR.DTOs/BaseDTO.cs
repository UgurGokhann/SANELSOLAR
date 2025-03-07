using System;

namespace SANELSOLAR.DTOs
{
    public abstract class BaseDTO
    {
        public DateTime? CreatedDate { get; set; }
        public int? CreatedUserId { get; set; }
        public int? UpdatedUserId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
} 