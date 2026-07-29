using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        throw new UnauthorizedAccessException("Invalid user token");
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetOrderById(int id)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.GetOrderByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        if (!User.IsInRole("Admin") && result.Data.UserId != userId)
        {
            return Forbid();
        }

        return Ok(result);
    }

    [HttpGet("my-orders")]
    public async Task<ActionResult<ApiResponse<List<OrderDto>>>> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.GetUserOrdersAsync(userId);
        return Ok(result);
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.CreateOrderFromCartAsync(userId, createOrderDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto updateOrderStatusDto)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, updateOrderStatusDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<List<OrderDto>>>> GetAllOrders()
    {
        var result = await _orderService.GetAllOrdersAsync();
        return Ok(result);
    }
}
