using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Discount> Discounts { get; set; }
    public DbSet<DiscountProduct> DiscountProducts { get; set; }
    public DbSet<DiscountCategory> DiscountCategories { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        // Category configuration
        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Product configuration
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.SKU)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => new { p.IsActive, p.StockQuantity });

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.CategoryId);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Price);

        modelBuilder.Entity<Product>()
            .HasIndex(p => new { p.CategoryId, p.IsActive });

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Discount configuration
        modelBuilder.Entity<Discount>()
            .HasIndex(d => d.Code)
            .IsUnique();

        modelBuilder.Entity<Discount>()
            .HasIndex(d => new { d.Code, d.IsActive });

        modelBuilder.Entity<Discount>()
            .HasIndex(d => new { d.IsActive, d.StartDate, d.EndDate });

        // DiscountProduct many-to-many
        modelBuilder.Entity<DiscountProduct>()
            .HasKey(dp => new { dp.DiscountId, dp.ProductId });

        modelBuilder.Entity<DiscountProduct>()
            .HasOne(dp => dp.Discount)
            .WithMany(d => d.DiscountProducts)
            .HasForeignKey(dp => dp.DiscountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DiscountProduct>()
            .HasOne(dp => dp.Product)
            .WithMany(p => p.DiscountProducts)
            .HasForeignKey(dp => dp.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // DiscountCategory many-to-many
        modelBuilder.Entity<DiscountCategory>()
            .HasKey(dc => new { dc.DiscountId, dc.CategoryId });

        modelBuilder.Entity<DiscountCategory>()
            .HasOne(dc => dc.Discount)
            .WithMany(d => d.DiscountCategories)
            .HasForeignKey(dc => dc.DiscountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DiscountCategory>()
            .HasOne(dc => dc.Category)
            .WithMany(c => c.DiscountCategories)
            .HasForeignKey(dc => dc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Cart configuration
        modelBuilder.Entity<Cart>()
            .HasIndex(c => c.UserId)
            .IsUnique();

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithMany(u => u.Carts)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // CartItem configuration
        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => new { ci.CartId, ci.ProductId });

        // Order configuration
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderNumber)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(o => new { o.UserId, o.CreatedDate });

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderStatus);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Discount)
            .WithMany(d => d.Orders)
            .HasForeignKey(o => o.DiscountId)
            .OnDelete(DeleteBehavior.SetNull);

        // OrderItem configuration
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasIndex(oi => new { oi.OrderId, oi.ProductId });

        // RefreshToken configuration
        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(rt => rt.Token);
    }
}
