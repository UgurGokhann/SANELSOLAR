using AutoMapper;
using FluentValidation;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SANELSOLAR.Business.Services
{
    public class CustomerService : Service<CustomerCreateDto, CustomerUpdateDto, CustomerListDto, Customer>, ICustomerService
    {
        private readonly IMapper _mapper;
        private readonly IUow _uow;

        public CustomerService(
            IMapper mapper,
            IValidator<CustomerCreateDto> createDtoValidator,
            IValidator<CustomerUpdateDto> updateDtoValidator,
            IUow uow) : base(mapper, createDtoValidator, updateDtoValidator, uow)
        {
            _mapper = mapper;
            _uow = uow;
        }

        public async Task<IResponse<List<CustomerListDto>>> SearchCustomersAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return await GetAllAsync();
                }

                searchTerm = searchTerm.ToLower();
                var customers = await _uow.GetRepository<Customer>().GetAllAsync(
                    x => x.Fullname.ToLower().Contains(searchTerm) ||
                         x.Email.ToLower().Contains(searchTerm) ||
                         x.Phone.Contains(searchTerm));

                var customerDtos = _mapper.Map<List<CustomerListDto>>(customers);
                return new Response<List<CustomerListDto>>(ResponseType.Success, customerDtos);
            }
            catch (Exception ex)
            {
                return new Response<List<CustomerListDto>>(ResponseType.Error, $"Müşteri arama sırasında bir hata oluştu: {ex.Message}");
            }
        }
    }
} 