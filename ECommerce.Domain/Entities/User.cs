using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class User : BaseEntity
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(512)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public int RoleId { get; set; }

    [ForeignKey(nameof(RoleId))]
    public Role? Role { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
