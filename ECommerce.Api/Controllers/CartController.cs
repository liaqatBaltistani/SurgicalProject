using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<CartDto>>> GetCart()
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.GetCartByUserIdAsync(userId);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<ApiResponse<CartDto>>> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.AddToCartAsync(userId, addToCartDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("items/{cartItemId}")]
    public async Task<ActionResult<ApiResponse<CartDto>>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateCartItemDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("items/{cartItemId}")]
    public async Task<ActionResult<ApiResponse<CartDto>>> RemoveFromCart(int cartItemId)
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.RemoveFromCartAsync(userId, cartItemId);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("clear")]
    public async Task<ActionResult<ApiResponse<CartDto>>> ClearCart()
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.ClearCartAsync(userId);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
