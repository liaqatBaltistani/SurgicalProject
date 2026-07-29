using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
    Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken);
    Task<ApiResponse<bool>> LogoutAsync(int userId);
}
