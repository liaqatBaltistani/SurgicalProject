using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class Discount : BaseEntity
{
    [Key]
    public int DiscountId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string Code { get; set; } = string.Empty;

    [Required]
    public DiscountType DiscountType { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Value { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? MinimumOrderAmount { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? MaxDiscountAmount { get; set; }

    public bool IsActive { get; set; } = true;

    public int? MaxUsageCount { get; set; }
    public int CurrentUsageCount { get; set; } = 0;

    // Navigation properties
    public virtual ICollection<DiscountProduct> DiscountProducts { get; set; } = new List<DiscountProduct>();
    public virtual ICollection<DiscountCategory> DiscountCategories { get; set; } = new List<DiscountCategory>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
