using AutoMapper;
using FluentValidation;
using SANELSOLAR.Business.Helpers;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Services
{
    public class UserService : Service<UserCreateDto, UserUpdateDto, UserDto, User>, IUserService
    {
        private readonly IValidator<UserLoginDto> _userLoginDtoValidator;
        private readonly IValidator<UserPasswordUpdateDto> _userPasswordUpdateDtoValidator;
        private readonly IJwtService _jwtService;
        private readonly IUow _uow;
        private readonly IMapper _mapper;

        public UserService(
            IMapper mapper,
            IValidator<UserCreateDto> createDtoValidator,
            IValidator<UserUpdateDto> updateDtoValidator,
            IValidator<UserLoginDto> userLoginDtoValidator,
            IValidator<UserPasswordUpdateDto> userPasswordUpdateDtoValidator,
            IJwtService jwtService,
            IUow uow) : base(mapper, createDtoValidator, updateDtoValidator, uow)
        {
            _userLoginDtoValidator = userLoginDtoValidator;
            _userPasswordUpdateDtoValidator = userPasswordUpdateDtoValidator;
            _jwtService = jwtService;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<IResponse<TokenDto>> LoginAsync(UserLoginDto userLoginDto)
        {
            try
            {
                // Validate DTO
                var emptyTokenDto = new TokenDto();
                var validationResult = _userLoginDtoValidator.Validate(userLoginDto);
                if (!validationResult.IsValid)
                {
                    return new Response<TokenDto>(ResponseType.ValidationError, emptyTokenDto)
                    {
                        ValidationErrors = validationResult.Errors.Select(x => new CustomValidationError
                        {
                            ErrorMessage = x.ErrorMessage,
                            PropertyName = x.PropertyName
                        }).ToList()
                    };
                }

                // Find user by username
                var user = await _uow.GetRepository<User>()
                    .GetByFilterAsync(x => x.Username == userLoginDto.Username);

                // Check if user exists
                if (user == null)
                {
                    return new Response<TokenDto>(ResponseType.NotFound, "Kullanıcı adı veya şifre hatalı");
                }

                // Verify password
                bool isPasswordValid = PasswordHelper.VerifyPassword(userLoginDto.Password, user.Password);
                if (!isPasswordValid)
                {
                    return new Response<TokenDto>(ResponseType.NotFound, "Kullanıcı adı veya şifre hatalı");
                }

                // Generate JWT token with user roles
                var roles = new List<string> { user.Role }; // In a real app, you might fetch roles from a role service
                var token = _jwtService.GenerateJwt(user, roles);

                if (string.IsNullOrEmpty(token))
                {
                    return new Response<TokenDto>(ResponseType.Error, "Token oluşturulurken bir hata oluştu");
                }

                // Map user to DTO
                var userDto = _mapper.Map<UserDto>(user);

                // Create and return token response
                var tokenDto = new TokenDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(60), // This should match the JWT config
                    User = userDto
                };

                return new Response<TokenDto>(ResponseType.Success, tokenDto);
            }
            catch (Exception ex)
            {
                return new Response<TokenDto>(ResponseType.Error, $"Giriş sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse> ChangePasswordAsync(UserPasswordUpdateDto userPasswordUpdateDto)
        {
            try
            {
                // Validate DTO
                var validationResult = _userPasswordUpdateDtoValidator.Validate(userPasswordUpdateDto);
                if (!validationResult.IsValid)
                {
                    return new Response<UserPasswordUpdateDto>(ResponseType.ValidationError, userPasswordUpdateDto)
                    {
                        ValidationErrors = validationResult.Errors.Select(x => new CustomValidationError
                        {
                            ErrorMessage = x.ErrorMessage,
                            PropertyName = x.PropertyName
                        }).ToList()
                    };
                }

                // Find user
                var user = await _uow.GetRepository<User>().FindAsync(userPasswordUpdateDto.UserId);
                if (user == null)
                {
                    return new Response(ResponseType.NotFound, "Kullanıcı bulunamadı");
                }

                // Verify current password
                bool isCurrentPasswordValid = PasswordHelper.VerifyPassword(userPasswordUpdateDto.CurrentPassword, user.Password);
                if (!isCurrentPasswordValid)
                {
                    return new Response(ResponseType.Error, "Mevcut şifre hatalı");
                }

                // Check if new and confirm passwords match (this should already be validated by the validator)
                if (userPasswordUpdateDto.NewPassword != userPasswordUpdateDto.ConfirmPassword)
                {
                    return new Response(ResponseType.ValidationError, "Yeni şifre ve şifre tekrarı eşleşmiyor");
                }

                // Hash new password
                user.Password = PasswordHelper.HashPassword(userPasswordUpdateDto.NewPassword);
                user.UpdatedDate = DateTime.Now;

                // Update user
                _uow.GetRepository<User>().Update(user, user);
                await _uow.SaveChangesAsync();

                return new Response(ResponseType.Success, "Şifre başarıyla güncellendi");
            }
            catch (Exception ex)
            {
                return new Response(ResponseType.Error, $"Şifre değiştirme sırasında bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<UserDto>> GetUserByUsernameAsync(string username)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    return new Response<UserDto>(ResponseType.ValidationError, "Kullanıcı adı boş olamaz");
                }

                var user = await _uow.GetRepository<User>()
                    .GetByFilterAsync(x => x.Username == username);

                if (user == null)
                {
                    return new Response<UserDto>(ResponseType.NotFound, "Kullanıcı bulunamadı");
                }

                var userDto = _mapper.Map<UserDto>(user);
                return new Response<UserDto>(ResponseType.Success, userDto);
            }
            catch (Exception ex)
            {
                return new Response<UserDto>(ResponseType.Error, $"Kullanıcı bilgilerini getirirken bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse<bool>> CheckUserExistsAsync(string username, string email)
        {
            try
            {
                var userExists = await _uow.GetRepository<User>()
                    .GetByFilterAsync(x => x.Username == username || x.Email == email);

                return new Response<bool>(ResponseType.Success, userExists != null);
            }
            catch (Exception ex)
            {
                return new Response<bool>(ResponseType.Error, $"Kullanıcı kontrolü sırasında bir hata oluştu: {ex.Message}");
            }
        }

        // Override CreateAsync to hash the password before saving
        public async Task<IResponse<UserCreateDto>> CreateUserAsync(UserCreateDto dto)
        {
            try
            {
                // Check if user already exists
                var userExists = await CheckUserExistsAsync(dto.Username, dto.Email);
                if (userExists.ResponseType == ResponseType.Success && userExists.Data)
                {
                    return new Response<UserCreateDto>(ResponseType.ValidationError, "Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor");
                }

                // Hash password
                var entity = _mapper.Map<User>(dto);
                entity.Password = PasswordHelper.HashPassword(dto.Password);
                entity.CreatedDate = DateTime.Now;

                // Create user
                await _uow.GetRepository<User>().CreateAsync(entity);
                await _uow.SaveChangesAsync();

                return new Response<UserCreateDto>(ResponseType.Success, dto);
            }
            catch (Exception ex)
            {
                return new Response<UserCreateDto>(ResponseType.Error, $"Kullanıcı oluşturma sırasında bir hata oluştu: {ex.Message}");
            }
        }
    }
} 