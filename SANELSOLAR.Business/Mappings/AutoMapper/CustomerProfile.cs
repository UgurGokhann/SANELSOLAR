using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            // Customer -> CustomerDto eşleştirmeleri
            CreateMap<CustomerCreateDto, Customer>().ReverseMap();
            CreateMap<CustomerUpdateDto, Customer>().ReverseMap();
        }
    }
} 