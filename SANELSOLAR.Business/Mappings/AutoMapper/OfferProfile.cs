using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class OfferProfile : Profile
    {
        public OfferProfile()
        {
            // Offer mappings
            CreateMap<Offer, CreateOfferDto>().ReverseMap();
            CreateMap<Offer, UpdateOfferDto>().ReverseMap();
            CreateMap<Offer, ListOfferDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Fullname))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FirstName));

            // OfferItem mappings
            CreateMap<OfferItem, CreateOfferItemDto>().ReverseMap();
            CreateMap<OfferItem, UpdateOfferItemDto>().ReverseMap();
            CreateMap<OfferItem, ListOfferItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                ;
        }
    }
    
} 