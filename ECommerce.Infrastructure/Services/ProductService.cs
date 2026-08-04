using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(int productId)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.ProductId == productId)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Sku = p.SKU,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return ApiResponse<ProductDto>.ErrorResponse("Product not found");
        }

        return ApiResponse<ProductDto>.SuccessResponse(product);
    }

    public async Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Sku = p.SKU,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            })
            .ToListAsync();

        return ApiResponse<List<ProductDto>>.SuccessResponse(products);
    }

    public async Task<ApiResponse<List<ProductDto>>> GetProductsByCategoryAsync(int categoryId)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == categoryId);
        if (!categoryExists)
        {
            return ApiResponse<List<ProductDto>>.ErrorResponse("Category not found");
        }

        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Sku = p.SKU,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            })
            .ToListAsync();

        return ApiResponse<List<ProductDto>>.SuccessResponse(products);
    }

    public async Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto productDto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == productDto.CategoryId);
        if (!categoryExists)
        {
            return ApiResponse<ProductDto>.ErrorResponse("Category not found");
        }

        var product = new Product
        {
            SKU = productDto.Sku,
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            StockQuantity = productDto.StockQuantity,
            ImageUrl = productDto.ImageUrl,
            CategoryId = productDto.CategoryId,
            IsActive = true
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var result = new ProductDto
        {
            ProductId = product.ProductId,
            Sku = product.SKU,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive,
            CategoryId = product.CategoryId
        };

        return ApiResponse<ProductDto>.SuccessResponse(result, "Product created successfully");
    }

    public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int productId, UpdateProductDto productDto)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            return ApiResponse<ProductDto>.ErrorResponse("Product not found");
        }

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.StockQuantity = productDto.StockQuantity;
        product.ImageUrl = productDto.ImageUrl;
        product.IsActive = productDto.IsActive;

        await _context.SaveChangesAsync();

        var result = new ProductDto
        {
            ProductId = product.ProductId,
            Sku = product.SKU,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive,
            CategoryId = product.CategoryId
        };

        return ApiResponse<ProductDto>.SuccessResponse(result, "Product updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteProductAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            return ApiResponse<bool>.ErrorResponse("Product not found");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Product deleted successfully");
    }

    public async Task<ApiResponse<(List<ProductDto> Products, int TotalCount)>> SearchProductsAsync(ProductSearchDto searchDto)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
        {
            query = query.Where(p => p.Name.Contains(searchDto.SearchTerm) || 
                                     p.Description!.Contains(searchDto.SearchTerm));
        }

        if (searchDto.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == searchDto.CategoryId.Value);
        }

        if (searchDto.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= searchDto.MinPrice.Value);
        }

        if (searchDto.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= searchDto.MaxPrice.Value);
        }

        if (searchDto.InStockOnly.HasValue && searchDto.InStockOnly.Value)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        var totalCount = await query.CountAsync();

        var products = await query
            .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Sku = p.SKU,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            })
            .ToListAsync();

        return ApiResponse<(List<ProductDto>, int)>.SuccessResponse((products, totalCount));
    }
}
