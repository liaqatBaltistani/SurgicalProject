using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ECommerce.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IJwtService jwtService, IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _configuration = configuration;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingUser != null)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("User with this email already exists");
        }

        // Get Customer role
        var customerRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Customer");

        if (customerRole == null)
        {
            // Create Customer role if it doesn't exist
            customerRole = new Role { Name = "Customer" };
            _context.Roles.Add(customerRole);
            await _context.SaveChangesAsync();
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create user
        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            RoleId = customerRole.RoleId,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate tokens
        var token = _jwtService.GenerateToken(user.UserId, user.Email, customerRole.Name);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationInMinutes = int.Parse(jwtSettings["ExpirationInMinutes"]!);
        var refreshExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationInDays"]!);

        // Store refresh token in database
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.UserId,
            Expires = DateTime.UtcNow.AddDays(refreshExpirationDays),
            Created = DateTime.UtcNow
        };
        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        var authResponse = new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            RefreshTokenExpiration = DateTime.UtcNow.AddDays(refreshExpirationDays),
            User = new UserDto
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = customerRole.Name
            }
        };

        return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "Registration successful");
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        // Find user by email
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("User account is deactivated");
        }

        // Generate tokens
        var token = _jwtService.GenerateToken(user.UserId, user.Email, user.Role.Name);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationInMinutes = int.Parse(jwtSettings["ExpirationInMinutes"]!);
        var refreshExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationInDays"]!);

        // Revoke old refresh tokens for this user
        var oldRefreshTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == user.UserId && rt.Revoked == null && rt.Expires > DateTime.UtcNow)
            .ToListAsync();
        
        foreach (var oldToken in oldRefreshTokens)
        {
            oldToken.Revoked = DateTime.UtcNow;
            oldToken.ReasonRevoked = "Replaced by new login";
        }

        // Store new refresh token in database
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.UserId,
            Expires = DateTime.UtcNow.AddDays(refreshExpirationDays),
            Created = DateTime.UtcNow
        };
        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        var authResponse = new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            RefreshTokenExpiration = DateTime.UtcNow.AddDays(refreshExpirationDays),
            User = new UserDto
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.Name
            }
        };

        return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "Login successful");
    }

    public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        // Find the refresh token in database
        var storedRefreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedRefreshToken == null)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid refresh token");
        }

        // Check if refresh token is active
        if (!storedRefreshToken.IsActive)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("Refresh token is expired or revoked");
        }

        // Check if user is still active
        if (!storedRefreshToken.User.IsActive)
        {
            return ApiResponse<AuthResponseDto>.ErrorResponse("User account is deactivated");
        }

        // Revoke old refresh token
        storedRefreshToken.Revoked = DateTime.UtcNow;
        storedRefreshToken.ReasonRevoked = "Replaced by new token";

        // Generate new tokens
        var newToken = _jwtService.GenerateToken(storedRefreshToken.User.UserId, storedRefreshToken.User.Email, storedRefreshToken.User.Role.Name);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationInMinutes = int.Parse(jwtSettings["ExpirationInMinutes"]!);
        var refreshExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationInDays"]!);

        // Store new refresh token
        var newRefreshTokenEntity = new RefreshToken
        {
            Token = newRefreshToken,
            UserId = storedRefreshToken.User.UserId,
            Expires = DateTime.UtcNow.AddDays(refreshExpirationDays),
            Created = DateTime.UtcNow,
            ReplacedByToken = newRefreshToken
        };
        _context.RefreshTokens.Add(newRefreshTokenEntity);
        await _context.SaveChangesAsync();

        var authResponse = new AuthResponseDto
        {
            Token = newToken,
            RefreshToken = newRefreshToken,
            TokenExpiration = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            RefreshTokenExpiration = DateTime.UtcNow.AddDays(refreshExpirationDays),
            User = new UserDto
            {
                UserId = storedRefreshToken.User.UserId,
                FirstName = storedRefreshToken.User.FirstName,
                LastName = storedRefreshToken.User.LastName,
                Email = storedRefreshToken.User.Email,
                Role = storedRefreshToken.User.Role.Name
            }
        };

        return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "Token refreshed successfully");
    }

    public async Task<ApiResponse<bool>> LogoutAsync(int userId)
    {
        // Revoke all active refresh tokens for this user
        var activeRefreshTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.Revoked == null && rt.Expires > DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in activeRefreshTokens)
        {
            token.Revoked = DateTime.UtcNow;
            token.ReasonRevoked = "User logged out";
        }

        await _context.SaveChangesAsync();
        
        return ApiResponse<bool>.SuccessResponse(true, "Logout successful");
    }
}
