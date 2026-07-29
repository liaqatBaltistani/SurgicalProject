using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities;

public class RefreshToken : BaseEntity
{
    [Key]
    public int RefreshTokenId { get; set; }

    [Required]
    [MaxLength(512)]
    public string Token { get; set; } = string.Empty;

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    public DateTime Expires { get; set; }

    public DateTime Created { get; set; }

    public DateTime? Revoked { get; set; }

    [MaxLength(256)]
    public string? ReplacedByToken { get; set; }

    [MaxLength(256)]
    public string? ReasonRevoked { get; set; }

    public bool IsExpired => DateTime.UtcNow >= Expires;

    public bool IsRevoked => Revoked != null;

    public bool IsActive => !IsRevoked && !IsExpired;
}
