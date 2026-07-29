using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class CategoryDto
{
    public int CategoryId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public int? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public int? ParentCategoryId { get; set; }
}

public class UpdateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public int? ParentCategoryId { get; set; }
    public bool IsActive { get; set; }
}
