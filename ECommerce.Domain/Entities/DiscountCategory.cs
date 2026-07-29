using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class DiscountCategory
{
    [Key]
    [Column(Order = 1)]
    public int DiscountId { get; set; }

    [Key]
    [Column(Order = 2)]
    public int CategoryId { get; set; }

    [ForeignKey(nameof(DiscountId))]
    public virtual Discount? Discount { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public virtual Category? Category { get; set; }
}
