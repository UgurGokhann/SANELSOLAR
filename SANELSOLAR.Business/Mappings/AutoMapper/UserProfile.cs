using AutoMapper;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;

namespace SANELSOLAR.Business.Mappings.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            // User -> UserDto eşleştirmeleri
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<UserLoginDto, User>().ReverseMap();
            CreateMap<UserCreateDto, User>().ReverseMap();
            CreateMap<UserUpdateDto, User>().ReverseMap();
            CreateMap<UserPasswordUpdateDto, User>()
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.NewPassword));
        }
    }
} 