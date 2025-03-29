using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class OfferTemplateProfile : Profile
    {
        public OfferTemplateProfile()
        {
            // OfferTemplate mappings
            CreateMap<OfferTemplate, CreateOfferTemplateDto>().ReverseMap();
            CreateMap<OfferTemplate, UpdateOfferTemplateDto>().ReverseMap();
            CreateMap<OfferTemplate, ListOfferTemplateDto>().ReverseMap();
            
            // PartnerInfo mappings
            CreateMap<PartnerInfo, PartnerInfoDto>().ReverseMap();
        }
    }
} 