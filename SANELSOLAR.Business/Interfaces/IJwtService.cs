using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwt(User user, List<string> roles);
        bool ValidateToken(string token);
        int? GetUserIdFromToken(string token);
    }
} 