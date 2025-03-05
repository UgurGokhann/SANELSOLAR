using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SANELSOLAR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var response = await _userService.LoginAsync(userLoginDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<TokenDto>)?.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserCreateDto userCreateDto)
        {
            var response = await _userService.CreateUserAsync(userCreateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Created("", response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<UserCreateDto>)?.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] UserPasswordUpdateDto passwordUpdateDto)
        {
            var response = await _userService.ChangePasswordAsync(passwordUpdateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Message),
                ResponseType.ValidationError => BadRequest((response as Response<UserPasswordUpdateDto>)?.ValidationErrors),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _userService.GetByIdAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("by-username/{username}")]
        [Authorize]
        public async Task<IActionResult> GetByUsername(string username)
        {
            var response = await _userService.GetUserByUsernameAsync(username);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst("username")?.Value;
            
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Kullanıcı bilgisi bulunamadı");
            }
            
            var response = await _userService.GetUserByUsernameAsync(username);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            if (id != userUpdateDto.UserId)
                return BadRequest("Route id and user id do not match");

            var response = await _userService.UpdateAsync(userUpdateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _userService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => NoContent(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("check-exists")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckUserExists([FromQuery] string username, [FromQuery] string email)
        {
            var response = await _userService.CheckUserExistsAsync(username, email);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                _ => BadRequest(response.Message)
            };
        }
    }
} 