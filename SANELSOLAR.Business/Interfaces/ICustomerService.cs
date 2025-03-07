using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface ICustomerService : IService<CustomerCreateDto, CustomerUpdateDto, CustomerListDto, Customer>
    {
        // Add any customer-specific methods here if needed
        Task<IResponse<List<CustomerListDto>>> SearchCustomersAsync(string searchTerm);
    }
} 