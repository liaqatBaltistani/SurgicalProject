using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync();
    Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int categoryId);
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto categoryDto);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int categoryId, UpdateCategoryDto categoryDto);
    Task<ApiResponse<bool>> DeleteCategoryAsync(int categoryId);
}
