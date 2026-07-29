using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IDiscountService
{
    Task<ApiResponse<DiscountDto>> GetDiscountByIdAsync(int discountId);
    Task<ApiResponse<DiscountDto>> GetDiscountByCodeAsync(string code);
    Task<ApiResponse<List<DiscountDto>>> GetAllActiveDiscountsAsync();
    Task<ApiResponse<DiscountDto>> CreateDiscountAsync(CreateDiscountDto discountDto);
    Task<ApiResponse<DiscountDto>> UpdateDiscountAsync(int discountId, UpdateDiscountDto discountDto);
    Task<ApiResponse<bool>> DeleteDiscountAsync(int discountId);
    Task<ApiResponse<DiscountCalculationResult>> CalculateDiscountAsync(string code, decimal orderAmount, List<int>? productIds = null);
}
