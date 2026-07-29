using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface	IProductService
{
    Task<ApiResponse<ProductDto>> GetProductByIdAsync(int productId);
    Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync();
    Task<ApiResponse<List<ProductDto>>> GetProductsByCategoryAsync(int categoryId);
    Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto productDto);
    Task<ApiResponse<ProductDto>> UpdateProductAsync(int productId, UpdateProductDto productDto);
    Task<ApiResponse<bool>> DeleteProductAsync(int productId);
    Task<ApiResponse<(List<ProductDto> Products, int TotalCount)>> SearchProductsAsync(ProductSearchDto searchDto);
}
