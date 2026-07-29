namespace ECommerce.Domain.Entities;

public abstract class BaseEntity
{
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;
}
