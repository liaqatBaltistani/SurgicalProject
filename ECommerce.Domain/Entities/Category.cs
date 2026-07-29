using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class Category : BaseEntity
{
    [Key]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public int? ParentCategoryId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(ParentCategoryId))]
    public virtual Category? ParentCategory { get; set; }
    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public virtual ICollection<DiscountCategory> DiscountCategories { get; set; } = new List<DiscountCategory>();
}
