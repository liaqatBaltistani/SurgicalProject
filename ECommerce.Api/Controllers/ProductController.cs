using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("{id}")]
    [OutputCache(PolicyName = "ProductCache")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProductById(int id)
    {
        var result = await _productService.GetProductByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpGet]
    [OutputCache(PolicyName = "ProductsCache")]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAllProducts()
    {
        var result = await _productService.GetAllProductsAsync();
        return Ok(result);
    }

    [HttpGet("category/{categoryId}")]
    [OutputCache(PolicyName = "ProductsCache")]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetProductsByCategory(int categoryId)
    {
        var result = await _productService.GetProductsByCategoryAsync(categoryId);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<(List<ProductDto> Products, int TotalCount)>>> SearchProducts([FromQuery] ProductSearchDto searchDto)
    {
        var result = await _productService.SearchProductsAsync(searchDto);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductDto productDto)
    {
        var result = await _productService.CreateProductAsync(productDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetProductById), new { id = result.Data.ProductId }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(int id, [FromBody] UpdateProductDto productDto)
    {
        var result = await _productService.UpdateProductAsync(id, productDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
