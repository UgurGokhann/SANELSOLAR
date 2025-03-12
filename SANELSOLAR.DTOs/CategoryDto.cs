using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SANELSOLAR.DTOs
{
    // DTO for creating a new category
    public class CategoryCreateDto : BaseDTO
    {
        public string Name { get; set; }
        
        // Açıklama alanı opsiyonel
        public string? Description { get; set; } = null;
        
        // Opsiyonel olarak işaretlendi
        public List<ProductCreateDto>? Products { get; set; } = null;
    }

    // DTO for updating an existing category
    public class CategoryUpdateDto : BaseDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        
        // Açıklama alanı opsiyonel
        public string? Description { get; set; } = null;
    }
    
    // DTO for listing categories
    public class CategoryListDto : BaseDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public List<ProductCreateDto>? Products { get; set; } = null;
        public int ProductCount { get; set; } 
    }
} 