using System.ComponentModel.DataAnnotations;

namespace ECommerce.Domain.Entities;

public class Role
{
    [Key]
    public int RoleId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
