using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int orderId);
    Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId);
    Task<ApiResponse<OrderDto>> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto);
    Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto updateOrderStatusDto);
    Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync();
}
