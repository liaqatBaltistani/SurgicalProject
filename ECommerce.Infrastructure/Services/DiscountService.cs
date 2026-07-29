using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class DiscountService : IDiscountService
{
    private readonly ApplicationDbContext _context;

    public DiscountService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<DiscountDto>> GetDiscountByIdAsync(int discountId)
    {
        var discount = await _context.Discounts
            .Include(d => d.DiscountProducts)
            .Include(d => d.DiscountCategories)
            .Where(d => d.DiscountId == discountId)
            .Select(d => new DiscountDto
            {
                DiscountId = d.DiscountId,
                Code = d.Code,
                DiscountType = d.DiscountType,
                Value = d.Value,
                MinimumOrderAmount = d.MinimumOrderAmount,
                StartDate = d.StartDate,
                EndDate = d.EndDate,
                IsActive = d.IsActive,
                MaxUsageCount = d.MaxUsageCount,
                CurrentUsageCount = d.CurrentUsageCount,
                ApplicableProductIds = d.DiscountProducts.Select(dp => dp.ProductId).ToList(),
                ApplicableCategoryIds = d.DiscountCategories.Select(dc => dc.CategoryId).ToList()
            })
            .FirstOrDefaultAsync();

        if (discount == null)
        {
            return ApiResponse<DiscountDto>.ErrorResponse("Discount not found");
        }

        return ApiResponse<DiscountDto>.SuccessResponse(discount);
    }

    public async Task<ApiResponse<DiscountDto>> GetDiscountByCodeAsync(string code)
    {
        var discount = await _context.Discounts
            .Include(d => d.DiscountProducts)
            .Include(d => d.DiscountCategories)
            .Where(d => d.Code == code)
            .Select(d => new DiscountDto
            {
                DiscountId = d.DiscountId,
                Code = d.Code,
                DiscountType = d.DiscountType,
                Value = d.Value,
                MinimumOrderAmount = d.MinimumOrderAmount,
                StartDate = d.StartDate,
                EndDate = d.EndDate,
                IsActive = d.IsActive,
                MaxUsageCount = d.MaxUsageCount,
                CurrentUsageCount = d.CurrentUsageCount,
                ApplicableProductIds = d.DiscountProducts.Select(dp => dp.ProductId).ToList(),
                ApplicableCategoryIds = d.DiscountCategories.Select(dc => dc.CategoryId).ToList()
            })
            .FirstOrDefaultAsync();

        if (discount == null)
        {
            return ApiResponse<DiscountDto>.ErrorResponse("Discount not found");
        }

        return ApiResponse<DiscountDto>.SuccessResponse(discount);
    }

    public async Task<ApiResponse<List<DiscountDto>>> GetAllActiveDiscountsAsync()
    {
        var now = DateTime.UtcNow;

        var discounts = await _context.Discounts
            .Include(d => d.DiscountProducts)
            .Include(d => d.DiscountCategories)
            .Where(d => d.IsActive && 
                       (!d.StartDate.HasValue || d.StartDate <= now) && 
                       (!d.EndDate.HasValue || d.EndDate >= now) &&
                       (!d.MaxUsageCount.HasValue || d.CurrentUsageCount < d.MaxUsageCount))
            .Select(d => new DiscountDto
            {
                DiscountId = d.DiscountId,
                Code = d.Code,
                DiscountType = d.DiscountType,
                Value = d.Value,
                MinimumOrderAmount = d.MinimumOrderAmount,
                StartDate = d.StartDate,
                EndDate = d.EndDate,
                IsActive = d.IsActive,
                MaxUsageCount = d.MaxUsageCount,
                CurrentUsageCount = d.CurrentUsageCount,
                ApplicableProductIds = d.DiscountProducts.Select(dp => dp.ProductId).ToList(),
                ApplicableCategoryIds = d.DiscountCategories.Select(dc => dc.CategoryId).ToList()
            })
            .ToListAsync();

        return ApiResponse<List<DiscountDto>>.SuccessResponse(discounts);
    }

    public async Task<ApiResponse<DiscountDto>> CreateDiscountAsync(CreateDiscountDto discountDto)
    {
        var existingDiscount = await _context.Discounts
            .AnyAsync(d => d.Code == discountDto.Code);

        if (existingDiscount)
        {
            return ApiResponse<DiscountDto>.ErrorResponse("Discount code already exists");
        }

        var discount = new Discount
        {
            Code = discountDto.Code,
            DiscountType = discountDto.DiscountType,
            Value = discountDto.Value,
            MinimumOrderAmount = discountDto.MinimumOrderAmount,
            StartDate = discountDto.StartDate,
            EndDate = discountDto.EndDate,
            IsActive = true,
            MaxUsageCount = discountDto.MaxUsageCount,
            CurrentUsageCount = 0
        };

        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();

        if (discountDto.ApplicableProductIds != null && discountDto.ApplicableProductIds.Any())
        {
            foreach (var productId in discountDto.ApplicableProductIds)
            {
                _context.DiscountProducts.Add(new DiscountProduct
                {
                    DiscountId = discount.DiscountId,
                    ProductId = productId
                });
            }
        }

        if (discountDto.ApplicableCategoryIds != null && discountDto.ApplicableCategoryIds.Any())
        {
            foreach (var categoryId in discountDto.ApplicableCategoryIds)
            {
                _context.DiscountCategories.Add(new DiscountCategory
                {
                    DiscountId = discount.DiscountId,
                    CategoryId = categoryId
                });
            }
        }

        await _context.SaveChangesAsync();

        return await GetDiscountByIdAsync(discount.DiscountId);
    }

    public async Task<ApiResponse<DiscountDto>> UpdateDiscountAsync(int discountId, UpdateDiscountDto discountDto)
    {
        var discount = await _context.Discounts
            .Include(d => d.DiscountProducts)
            .Include(d => d.DiscountCategories)
            .FirstOrDefaultAsync(d => d.DiscountId == discountId);

        if (discount == null)
        {
            return ApiResponse<DiscountDto>.ErrorResponse("Discount not found");
        }

        var codeExists = await _context.Discounts
            .AnyAsync(d => d.Code == discountDto.Code && d.DiscountId != discountId);

        if (codeExists)
        {
            return ApiResponse<DiscountDto>.ErrorResponse("Discount code already exists");
        }

        discount.Code = discountDto.Code;
        discount.DiscountType = discountDto.DiscountType;
        discount.Value = discountDto.Value;
        discount.MinimumOrderAmount = discountDto.MinimumOrderAmount;
        discount.StartDate = discountDto.StartDate;
        discount.EndDate = discountDto.EndDate;
        discount.IsActive = discountDto.IsActive;
        discount.MaxUsageCount = discountDto.MaxUsageCount;

        _context.DiscountProducts.RemoveRange(discount.DiscountProducts);
        _context.DiscountCategories.RemoveRange(discount.DiscountCategories);

        if (discountDto.ApplicableProductIds != null && discountDto.ApplicableProductIds.Any())
        {
            foreach (var productId in discountDto.ApplicableProductIds)
            {
                _context.DiscountProducts.Add(new DiscountProduct
                {
                    DiscountId = discount.DiscountId,
                    ProductId = productId
                });
            }
        }

        if (discountDto.ApplicableCategoryIds != null && discountDto.ApplicableCategoryIds.Any())
        {
            foreach (var categoryId in discountDto.ApplicableCategoryIds)
            {
                _context.DiscountCategories.Add(new DiscountCategory
                {
                    DiscountId = discount.DiscountId,
                    CategoryId = categoryId
                });
            }
        }

        await _context.SaveChangesAsync();

        return await GetDiscountByIdAsync(discountId);
    }

    public async Task<ApiResponse<bool>> DeleteDiscountAsync(int discountId)
    {
        var discount = await _context.Discounts.FindAsync(discountId);
        if (discount == null)
        {
            return ApiResponse<bool>.ErrorResponse("Discount not found");
        }

        _context.Discounts.Remove(discount);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Discount deleted successfully");
    }

    public async Task<ApiResponse<DiscountCalculationResult>> CalculateDiscountAsync(string code, decimal orderAmount, List<int>? productIds = null)
    {
        var discount = await _context.Discounts
            .Include(d => d.DiscountProducts)
            .Include(d => d.DiscountCategories)
            .FirstOrDefaultAsync(d => d.Code == code);

        if (discount == null)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse("Invalid discount code");
        }

        var now = DateTime.UtcNow;

        if (!discount.IsActive)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount is not active");
        }

        if (discount.StartDate.HasValue && discount.StartDate > now)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount is not yet valid");
        }

        if (discount.EndDate.HasValue && discount.EndDate < now)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount has expired");
        }

        if (discount.MaxUsageCount.HasValue && discount.CurrentUsageCount >= discount.MaxUsageCount)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount usage limit reached");
        }

        if (discount.MinimumOrderAmount.HasValue && orderAmount < discount.MinimumOrderAmount)
        {
            return ApiResponse<DiscountCalculationResult>.ErrorResponse($"Minimum order amount of {discount.MinimumOrderAmount} required");
        }

        if (discount.DiscountProducts.Any() || discount.DiscountCategories.Any())
        {
            if (productIds == null || !productIds.Any())
            {
                return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount is only applicable to specific products");
            }

            var applicableProductIds = discount.DiscountProducts.Select(dp => dp.ProductId).ToHashSet();
            var applicableCategoryIds = discount.DiscountCategories.Select(dc => dc.CategoryId).ToHashSet();

            var productCategories = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .Select(p => new { p.ProductId, p.CategoryId })
                .ToListAsync();

            var hasApplicableProduct = productCategories.Any(p => 
                applicableProductIds.Contains(p.ProductId) || 
                applicableCategoryIds.Contains(p.CategoryId));

            if (!hasApplicableProduct)
            {
                return ApiResponse<DiscountCalculationResult>.ErrorResponse("Discount is not applicable to any products in your cart");
            }
        }

        decimal discountAmount = discount.DiscountType == DiscountType.Percentage
            ? orderAmount * (discount.Value / 100)
            : discount.Value;

        discountAmount = Math.Min(discountAmount, orderAmount);

        var result = new DiscountCalculationResult
        {
            OriginalAmount = orderAmount,
            DiscountAmount = discountAmount,
            FinalAmount = orderAmount - discountAmount,
            DiscountCode = discount.Code,
            DiscountDescription = discount.DiscountType == DiscountType.Percentage
                ? $"{discount.Value}% off"
                : $"${discount.Value} off"
        };

        return ApiResponse<DiscountCalculationResult>.SuccessResponse(result);
    }
}
