using System;
using System.Collections.Generic;

namespace SANELSOLAR.DTOs
{
    // DTO for creating a new product
    public class ProductCreateDto : BaseDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PriceUSD { get; set; }
        public List<int> CategoryIds { get; set; }
    }

    // DTO for updating an existing produc
    public class ProductUpdateDto : UpdateDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PriceUSD { get; set; }
        public List<int> CategoryIds { get; set; }
    }
} 