using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class Cart : BaseEntity
{
    [Key]
    public int CartId { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User? User { get; set; }

    // Navigation properties
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
