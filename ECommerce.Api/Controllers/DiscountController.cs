using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiscountController : ControllerBase
{
    private readonly IDiscountService _discountService;

    public DiscountController(IDiscountService discountService)
    {
        _discountService = discountService;
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<DiscountDto>>> GetDiscountById(int id)
    {
        var result = await _discountService.GetDiscountByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpGet("code/{code}")]
    public async Task<ActionResult<ApiResponse<DiscountDto>>> GetDiscountByCode(string code)
    {
        var result = await _discountService.GetDiscountByCodeAsync(code);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<List<DiscountDto>>>> GetAllActiveDiscounts()
    {
        var result = await _discountService.GetAllActiveDiscountsAsync();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<DiscountDto>>> CreateDiscount([FromBody] CreateDiscountDto discountDto)
    {
        var result = await _discountService.CreateDiscountAsync(discountDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetDiscountById), new { id = result.Data.DiscountId }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<DiscountDto>>> UpdateDiscount(int id, [FromBody] UpdateDiscountDto discountDto)
    {
        var result = await _discountService.UpdateDiscountAsync(id, discountDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteDiscount(int id)
    {
        var result = await _discountService.DeleteDiscountAsync(id);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<ApiResponse<DiscountCalculationResult>>> CalculateDiscount([FromBody] ApplyDiscountDto applyDiscountDto)
    {
        var result = await _discountService.CalculateDiscountAsync(
            applyDiscountDto.Code, 
            applyDiscountDto.OrderAmount, 
            applyDiscountDto.ProductIds);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
