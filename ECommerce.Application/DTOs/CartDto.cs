using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
    public int StockQuantity { get; set; }
}

public class CartDto
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public decimal TotalAmount => Items.Sum(i => i.TotalPrice);
    public int TotalItems => Items.Sum(i => i.Quantity);
}

public class AddToCartDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemDto
{
    [Range(1, 100)]
    public int Quantity { get; set; }
}
