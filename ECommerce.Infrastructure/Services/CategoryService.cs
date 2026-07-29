using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.ParentCategory)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Name = c.Name,
                Description = c.Description,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.Name : null,
                IsActive = c.IsActive
            })
            .ToListAsync();

        return ApiResponse<List<CategoryDto>>.SuccessResponse(categories);
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int categoryId)
    {
        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Where(c => c.CategoryId == categoryId)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Name = c.Name,
                Description = c.Description,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.Name : null,
                IsActive = c.IsActive
            })
            .FirstOrDefaultAsync();

        if (category == null)
        {
            return ApiResponse<CategoryDto>.ErrorResponse("Category not found");
        }

        return ApiResponse<CategoryDto>.SuccessResponse(category);
    }

    public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto categoryDto)
    {
        if (categoryDto.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.Categories.AnyAsync(c => c.CategoryId == categoryDto.ParentCategoryId.Value);
            if (!parentExists)
            {
                return ApiResponse<CategoryDto>.ErrorResponse("Parent category not found");
            }
        }

        var category = new Category
        {
            Name = categoryDto.Name,
            Description = categoryDto.Description,
            ParentCategoryId = categoryDto.ParentCategoryId,
            IsActive = true
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive
        };

        return ApiResponse<CategoryDto>.SuccessResponse(result, "Category created successfully");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int categoryId, UpdateCategoryDto categoryDto)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        if (category == null)
        {
            return ApiResponse<CategoryDto>.ErrorResponse("Category not found");
        }

        if (categoryDto.ParentCategoryId.HasValue)
        {
            if (categoryDto.ParentCategoryId == categoryId)
            {
                return ApiResponse<CategoryDto>.ErrorResponse("Category cannot be its own parent");
            }

            var parentExists = await _context.Categories.AnyAsync(c => c.CategoryId == categoryDto.ParentCategoryId.Value);
            if (!parentExists)
            {
                return ApiResponse<CategoryDto>.ErrorResponse("Parent category not found");
            }
        }

        category.Name = categoryDto.Name;
        category.Description = categoryDto.Description;
        category.ParentCategoryId = categoryDto.ParentCategoryId;
        category.IsActive = categoryDto.IsActive;

        await _context.SaveChangesAsync();

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive
        };

        return ApiResponse<CategoryDto>.SuccessResponse(result, "Category updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteCategoryAsync(int categoryId)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        if (category == null)
        {
            return ApiResponse<bool>.ErrorResponse("Category not found");
        }

        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == categoryId);
        if (hasProducts)
        {
            return ApiResponse<bool>.ErrorResponse("Cannot delete category with existing products");
        }

        var hasChildren = await _context.Categories.AnyAsync(c => c.ParentCategoryId == categoryId);
        if (hasChildren)
        {
            return ApiResponse<bool>.ErrorResponse("Cannot delete category with subcategories");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Category deleted successfully");
    }
}
