using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class CartService : ICartService
{
    private readonly ApplicationDbContext _context;

    public CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CartDto>> GetCartByUserIdAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart not found");
        }

        var cartDto = new CartDto
        {
            CartId = cart.CartId,
            UserId = cart.UserId,
            Items = cart.CartItems.Select(ci => new CartItemDto
            {
                CartItemId = ci.CartItemId,
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                ProductImage = ci.Product.ImageUrl,
                UnitPrice = ci.UnitPrice,
                Quantity = ci.Quantity,
                StockQuantity = ci.Product.StockQuantity
            }).ToList()
        };

        return ApiResponse<CartDto>.SuccessResponse(cartDto);
    }

    public async Task<ApiResponse<CartDto>> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        var product = await _context.Products.FindAsync(addToCartDto.ProductId);
        if (product == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Product not found");
        }

        if (!product.IsActive)
        {
            return ApiResponse<CartDto>.ErrorResponse("Product is not available");
        }

        if (product.StockQuantity < addToCartDto.Quantity)
        {
            return ApiResponse<CartDto>.ErrorResponse("Insufficient stock");
        }

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == addToCartDto.ProductId);

        if (existingCartItem != null)
        {
            existingCartItem.Quantity += addToCartDto.Quantity;
            existingCartItem.UnitPrice = product.Price;
        }
        else
        {
            cart.CartItems.Add(new CartItem
            {
                ProductId = addToCartDto.ProductId,
                Quantity = addToCartDto.Quantity,
                UnitPrice = product.Price
            });
        }

        await _context.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<ApiResponse<CartDto>> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart not found");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == cartItemId);
        if (cartItem == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart item not found");
        }

        if (cartItem.Product.StockQuantity < updateCartItemDto.Quantity)
        {
            return ApiResponse<CartDto>.ErrorResponse("Insufficient stock");
        }

        cartItem.Quantity = updateCartItemDto.Quantity;
        await _context.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<ApiResponse<CartDto>> RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart not found");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == cartItemId);
        if (cartItem == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart item not found");
        }

        cart.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }

    public async Task<ApiResponse<CartDto>> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return ApiResponse<CartDto>.ErrorResponse("Cart not found");
        }

        cart.CartItems.Clear();
        await _context.SaveChangesAsync();

        return await GetCartByUserIdAsync(userId);
    }
}
