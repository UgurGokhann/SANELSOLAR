using System;
using System.Collections.Generic;

namespace SANELSOLAR.Entities
{
    public class Product : BaseEntity
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PriceUSD { get; set; }

        // Navigation properties
        public ICollection<ProductCategory> ProductCategories { get; set; }
        public ICollection<OfferItem> OfferItems { get; set; }
    }
} 