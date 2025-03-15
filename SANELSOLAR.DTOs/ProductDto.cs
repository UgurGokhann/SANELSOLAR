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
        public string Unit { get; set; }
        public string Brand { get; set; }
        public List<int> CategoryIds { get; set; }
    }

    // DTO for updating an existing product
    public class ProductUpdateDto : BaseDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PriceUSD { get; set; }
        public string Unit { get; set; }
        public string Brand { get; set; }
        public List<int> CategoryIds { get; set; }
    }
    
    // DTO for listing products with categories
    public class ProductListDto : BaseDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PriceUSD { get; set; }
        public string Unit { get; set; }
        public string Brand { get; set; }
        public List<CategoryListDto> Categories { get; set; }
    }
} 