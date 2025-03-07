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
            CreateMap<CustomerCreateDto, Customer>()
                .ForMember(dest => dest.Fullname, opt => opt.MapFrom(src => $"{src.Firstname} {src.Lastname}"))
                .ReverseMap();
                
            CreateMap<CustomerUpdateDto, Customer>()
                .ForMember(dest => dest.Fullname, opt => opt.MapFrom(src => $"{src.Firstname} {src.Lastname}"))
                .ReverseMap();
                
            CreateMap<Customer, CustomerListDto>().ReverseMap();
        }
    }
} 