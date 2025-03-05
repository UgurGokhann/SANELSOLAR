using System;
using System.Collections.Generic;

namespace SANELSOLAR.DTOs
{
    // DTO for creating a new customer
    public class CustomerCreateDto : BaseDTO
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    // DTO for updating an existing customer
    public class CustomerUpdateDto : BaseDTO
    {
        public int CustomerId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
} 