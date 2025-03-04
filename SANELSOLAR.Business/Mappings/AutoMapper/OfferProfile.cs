using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class OfferProfile : Profile
    {
        public OfferProfile()
        {
            // Offer ve OfferItem için temel eşleştirmeler
            CreateMap<OfferItemCreateDto, OfferItem>().ReverseMap();
            CreateMap<OfferItemUpdateDto, OfferItem>().ReverseMap();
            
            CreateMap<OfferCreateDto, Offer>().ReverseMap();
            CreateMap<OfferUpdateDto, Offer>().ReverseMap();
            CreateMap<OfferStatusUpdateDto, Offer>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ReverseMap();
        }
    }
} 