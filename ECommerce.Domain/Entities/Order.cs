using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class Order : BaseEntity
{
    [Key]
    public int OrderId { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User? User { get; set; }

    [Required]
    [MaxLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string OrderNumber { get; set; } = string.Empty;

    [Required]
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DiscountAmount { get; set; } = 0;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount { get; set; } = 0;

    [Column(TypeName = "decimal(18,2)")]
    public decimal ShippingAmount { get; set; } = 0;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [MaxLength(500)]
    public string? ShippingAddress { get; set; }

    [MaxLength(20)]
    public string? ContactNumber { get; set; }

    public int? DiscountId { get; set; }

    [ForeignKey(nameof(DiscountId))]
    public virtual Discount? Discount { get; set; }

    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
