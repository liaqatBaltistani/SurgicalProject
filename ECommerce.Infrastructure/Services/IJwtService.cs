using System.Security.Claims;
using ECommerce.Application.DTOs;

namespace ECommerce.Infrastructure.Services;

public interface IJwtService
{
    string GenerateToken(int userId, string email, string role);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
}
