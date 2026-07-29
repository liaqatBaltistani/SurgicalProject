using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class DiscountProduct
{
    [Key]
    [Column(Order = 1)]
    public int DiscountId { get; set; }

    [Key]
    [Column(Order = 2)]
    public int ProductId { get; set; }

    [ForeignKey(nameof(DiscountId))]
    public virtual Discount? Discount { get; set; }

    [ForeignKey(nameof(ProductId))]
    public virtual Product? Product { get; set; }
}
