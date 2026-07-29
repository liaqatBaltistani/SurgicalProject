using System.ComponentModel.DataAnnotations;
using ECommerce.Domain.Enums;

namespace ECommerce.Application.DTOs;

public class OrderItemDto
{
    public int OrderItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
}

public class OrderDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string? DiscountCode { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
}

public class CreateOrderDto
{
    [Required]
    public string DiscountCode { get; set; } = string.Empty;
}

public class CreateOrderItemDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}

public class UpdateOrderStatusDto
{
    [Required]
    public OrderStatus OrderStatus { get; set; }
}
