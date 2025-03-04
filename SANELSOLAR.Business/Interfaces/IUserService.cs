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
    public interface IUserService : IService<UserCreateDto, UserUpdateDto, UserDto, User>
    {
        Task<IResponse<TokenDto>> LoginAsync(UserLoginDto userLoginDto);
        Task<IResponse> ChangePasswordAsync(UserPasswordUpdateDto userPasswordUpdateDto);
        Task<IResponse<UserDto>> GetUserByUsernameAsync(string username);
        Task<IResponse<bool>> CheckUserExistsAsync(string username, string email);
        Task<IResponse<UserCreateDto>> CreateUserAsync(UserCreateDto dto);
    }
} 