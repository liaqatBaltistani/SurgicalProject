using ECommerce.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class DiscountDto
{
    public int DiscountId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public DiscountType DiscountType { get; set; }
    
    [Required]
    public decimal Value { get; set; }
    
    public decimal? MinimumOrderAmount { get; set; }
    
    public DateTime? StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public bool IsActive { get; set; }
    
    public int? MaxUsageCount { get; set; }
    public int CurrentUsageCount { get; set; }
    
    public List<int> ApplicableProductIds { get; set; } = new List<int>();
    public List<int> ApplicableCategoryIds { get; set; } = new List<int>();
}

public class CreateDiscountDto
{
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public DiscountType DiscountType { get; set; }
    
    [Required]
    [Range(0.01, 100)]
    public decimal Value { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? MinimumOrderAmount { get; set; }
    
    public DateTime? StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public int? MaxUsageCount { get; set; }
    
    public List<int>? ApplicableProductIds { get; set; }
    public List<int>? ApplicableCategoryIds { get; set; }
}

public class UpdateDiscountDto
{
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public DiscountType DiscountType { get; set; }
    
    [Required]
    [Range(0.01, 100)]
    public decimal Value { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? MinimumOrderAmount { get; set; }
    
    public DateTime? StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public bool IsActive { get; set; }
    
    public int? MaxUsageCount { get; set; }
    
    public List<int>? ApplicableProductIds { get; set; }
    public List<int>? ApplicableCategoryIds { get; set; }
}

public class ApplyDiscountDto
{
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public decimal OrderAmount { get; set; }
    
    public List<int>? ProductIds { get; set; }
}

public class DiscountCalculationResult
{
    public decimal OriginalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public string DiscountCode { get; set; } = string.Empty;
    public string DiscountDescription { get; set; } = string.Empty;
}
