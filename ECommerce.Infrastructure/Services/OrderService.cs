using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly ICartService _cartService;
    private readonly IDiscountService _discountService;

    public OrderService(ApplicationDbContext context, ICartService cartService, IDiscountService discountService)
    {
        _context = context;
        _cartService = cartService;
        _discountService = discountService;
    }

    public async Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .Where(o => o.OrderId == orderId)
            .Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                OrderNumber = o.OrderNumber,
                UserId = o.UserId,
                UserName = o.User.Email,
                OrderStatus = o.OrderStatus,
                Subtotal = o.Subtotal,
                DiscountAmount = o.DiscountAmount,
                TotalAmount = o.TotalAmount,
                DiscountCode = o.Discount != null ? o.Discount.Code : null,
                CreatedDate = o.CreatedDate,
                UpdatedDate = o.ModifiedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImage = null,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return ApiResponse<OrderDto>.ErrorResponse("Order not found");
        }

        return ApiResponse<OrderDto>.SuccessResponse(order);
    }

    public async Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedDate)
            .Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                OrderNumber = o.OrderNumber,
                UserId = o.UserId,
                UserName = o.User.Email,
                OrderStatus = o.OrderStatus,
                Subtotal = o.Subtotal,
                DiscountAmount = o.DiscountAmount,
                TotalAmount = o.TotalAmount,
                DiscountCode = o.Discount != null ? o.Discount.Code : null,
                CreatedDate = o.CreatedDate,
                UpdatedDate = o.ModifiedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImage = null,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return ApiResponse<List<OrderDto>>.SuccessResponse(orders);
    }

    public async Task<ApiResponse<OrderDto>> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto)
    {
        var cartResult = await _cartService.GetCartByUserIdAsync(userId);
        
        if (!cartResult.Success || cartResult.Data == null)
        {
            return ApiResponse<OrderDto>.ErrorResponse("Cart not found or empty");
        }

        if (!cartResult.Data.Items.Any())
        {
            return ApiResponse<OrderDto>.ErrorResponse("Cart is empty");
        }

        var subtotal = cartResult.Data.TotalAmount;
        decimal discountAmount = 0;
        Discount? appliedDiscount = null;

        if (!string.IsNullOrWhiteSpace(createOrderDto.DiscountCode))
        {
            var productIds = cartResult.Data.Items.Select(i => i.ProductId).ToList();
            var discountResult = await _discountService.CalculateDiscountAsync(
                createOrderDto.DiscountCode, 
                subtotal, 
                productIds);

            if (discountResult.Success && discountResult.Data != null)
            {
                discountAmount = discountResult.Data.DiscountAmount;
                appliedDiscount = await _context.Discounts
                    .FirstOrDefaultAsync(d => d.Code == createOrderDto.DiscountCode);
            }
        }

        var totalAmount = subtotal - discountAmount;

        var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            OrderStatus = OrderStatus.Pending,
            Subtotal = subtotal,
            DiscountAmount = discountAmount,
            TotalAmount = totalAmount,
            DiscountId = appliedDiscount?.DiscountId,
            CreatedDate = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var cartItem in cartResult.Data.Items)
        {
            var product = await _context.Products.FindAsync(cartItem.ProductId);
            if (product != null)
            {
                if (product.StockQuantity < cartItem.Quantity)
                {
                    return ApiResponse<OrderDto>.ErrorResponse($"Insufficient stock for product: {cartItem.ProductName}");
                }

                product.StockQuantity -= cartItem.Quantity;

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.ProductName,
                    SKU = "SKU-" + cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice,
                    TotalAmount = cartItem.UnitPrice * cartItem.Quantity
                });
            }
        }

        if (appliedDiscount != null)
        {
            appliedDiscount.CurrentUsageCount++;
        }

        await _context.SaveChangesAsync();

        await _cartService.ClearCartAsync(userId);

        return await GetOrderByIdAsync(order.OrderId);
    }

    public async Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto updateOrderStatusDto)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null)
        {
            return ApiResponse<OrderDto>.ErrorResponse("Order not found");
        }

        order.OrderStatus = updateOrderStatusDto.OrderStatus;
        order.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(orderId);
    }

    public async Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.CreatedDate)
            .Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                OrderNumber = o.OrderNumber,
                UserId = o.UserId,
                UserName = o.User.Email,
                OrderStatus = o.OrderStatus,
                Subtotal = o.Subtotal,
                DiscountAmount = o.DiscountAmount,
                TotalAmount = o.TotalAmount,
                DiscountCode = o.Discount != null ? o.Discount.Code : null,
                CreatedDate = o.CreatedDate,
                UpdatedDate = o.ModifiedDate,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImage = null,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return ApiResponse<List<OrderDto>>.SuccessResponse(orders);
    }
}
