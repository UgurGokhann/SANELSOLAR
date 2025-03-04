using System;
using System.Collections.Generic;

namespace SANELSOLAR.Entities
{
    public class Customer : BaseEntity
    {
        public int CustomerId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        // Navigation properties
        public ICollection<Offer> Offers { get; set; }
    }
} 