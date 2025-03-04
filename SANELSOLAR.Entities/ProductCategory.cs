using System;
using System.Collections.Generic;

namespace SANELSOLAR.Entities
{
    public class ProductCategory : BaseEntity
    {
        public int ProductCategoryId { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
} 