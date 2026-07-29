using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Infrastructure Services
builder.Services.AddScoped<ECommerce.Infrastructure.Services.IJwtService, ECommerce.Infrastructure.Services.JwtService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.IAuthService, ECommerce.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.ICategoryService, ECommerce.Infrastructure.Services.CategoryService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.IProductService, ECommerce.Infrastructure.Services.ProductService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.ICartService, ECommerce.Infrastructure.Services.CartService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.IDiscountService, ECommerce.Infrastructure.Services.DiscountService>();
builder.Services.AddScoped<ECommerce.Application.Interfaces.IOrderService, ECommerce.Infrastructure.Services.OrderService>();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;
var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Add Controllers
builder.Services.AddControllers();

// Add Memory Cache
builder.Services.AddMemoryCache();

// Add Output Caching
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("ProductCache", builder =>
        builder.Expire(TimeSpan.FromMinutes(5)));
    options.AddPolicy("ProductsCache", builder =>
        builder.Expire(TimeSpan.FromMinutes(2)));
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:5156")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ECommerce API v1");
    options.RoutePrefix = "swagger";
});

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:5156 http://localhost:4200;");
    await next();
});

app.UseOutputCache();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();