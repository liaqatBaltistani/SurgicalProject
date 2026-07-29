using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface ICartService
{
    Task<ApiResponse<CartDto>> GetCartByUserIdAsync(int userId);
    Task<ApiResponse<CartDto>> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<ApiResponse<CartDto>> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto);
    Task<ApiResponse<CartDto>> RemoveFromCartAsync(int userId, int cartItemId);
    Task<ApiResponse<CartDto>> ClearCartAsync(int userId);
}
