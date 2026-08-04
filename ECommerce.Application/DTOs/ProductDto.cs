using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class ProductDto
{
    public int ProductId { get; set; }

    public string Sku { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; }

    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public decimal? DiscountedPrice { get; set; }
    public string? DiscountName { get; set; }
}

public class CreateProductDto
{
    [Required]
    [MaxLength(50)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Required]
    public int CategoryId { get; set; }
}

public class UpdateProductDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    public bool IsActive { get; set; }
}

public class ProductSearchDto
{
    public string? SearchTerm { get; set; }
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStockOnly { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
