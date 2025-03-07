using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class ExchangeRateProfile : Profile
    {
        public ExchangeRateProfile()
        {
            //// ExchangeRate için temel eşleştirmeler
            //CreateMap<ExchangeRateCreateDto, ExchangeRate>().ReverseMap();
            //CreateMap<ExchangeRateUpdateDto, ExchangeRate>().ReverseMap();
            
            //// Sadece sorgu için kullanılan DTO
            //CreateMap<LatestExchangeRateRequestDto, ExchangeRate>()
            //    .ForMember(dest => dest.FromCurrency, opt => opt.MapFrom(src => src.FromCurrency))
            //    .ForMember(dest => dest.ToCurrency, opt => opt.MapFrom(src => src.ToCurrency));
        }
    }
} 