using System;

namespace SANELSOLAR.DTOs
{
    // Standart User DTO
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    // DTO for user login
    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    // DTO for user registration
    public class UserCreateDto : BaseDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
    }

    // DTO for updating an existing user
    public class UserUpdateDto : BaseDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
    }

    // DTO for updating user password
    public class UserPasswordUpdateDto
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
} 