using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAllCategories()
    {
        var result = await _categoryService.GetAllCategoriesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetCategoryById(int id)
    {
        var result = await _categoryService.GetCategoryByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory([FromBody] CreateCategoryDto categoryDto)
    {
        var result = await _categoryService.CreateCategoryAsync(categoryDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetCategoryById), new { id = result.Data.CategoryId }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> UpdateCategory(int id, [FromBody] UpdateCategoryDto categoryDto)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, categoryDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
