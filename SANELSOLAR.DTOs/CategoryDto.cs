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
        public string Description { get; set; }
    }

    // DTO for updating an existing category
    public class CategoryUpdateDto : UpdateDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
} 