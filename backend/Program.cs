using BirthdayBackend.Data;
using BirthdayBackend.DTOs;
using BirthdayBackend.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

const string CorsPolicyName = "BirthdayWebsiteCors";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BirthdayDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("BirthdayDatabase")
        ?? "Data Source=birthday.db";

    options.UseSqlite(connectionString);
});

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase)
            || Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                && (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                    || uri.Host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase)))
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var logger = context.RequestServices
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger("GlobalExceptionHandler");
        var exceptionFeature = context.Features.Get<IExceptionHandlerFeature>();

        logger.LogError(exceptionFeature?.Error, "Unhandled exception while processing request.");

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = "Unexpected server error."
        });
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicyName);
app.UseDefaultFiles();
app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BirthdayDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseStartup");

    await SeedData.InitializeAsync(dbContext, logger);
}

app.MapPost("/api/wishes", async (
    CreateWishRequest request,
    BirthdayDbContext dbContext,
    ILogger<Program> logger) =>
{
    var errors = ValidateCreateWishRequest(request);

    if (errors.Count > 0)
    {
        return Results.BadRequest(new
        {
            success = false,
            message = "Validation failed.",
            errors
        });
    }

    var friendName = request.NormalizedFriendName;
    var wishMessage = request.NormalizedWishMessage;

    var duplicateExists = await dbContext.Wishes
        .AnyAsync(wish => wish.FriendName.ToLower() == friendName.ToLower());

    if (duplicateExists)
    {
        return Results.Conflict(new
        {
            success = false,
            message = "A wish has already been submitted using this name."
        });
    }

    var wish = new Wish
    {
        FriendName = friendName,
        WishMessage = wishMessage,
        CreatedAt = DateTime.UtcNow
    };

    dbContext.Wishes.Add(wish);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("New wish submitted by {FriendName}.", wish.FriendName);

    return Results.Created($"/api/wishes/{wish.Id}", new
    {
        success = true,
        message = "Wish added successfully."
    });
})
.WithName("CreateWish")
.WithOpenApi();

app.MapGet("/api/wishes", async (BirthdayDbContext dbContext) =>
{
    var wishes = await dbContext.Wishes
        .OrderBy(wish => wish.CreatedAt)
        .Select(wish => new WishResponse(
            wish.Id,
            wish.FriendName,
            wish.WishMessage,
            wish.CreatedAt))
        .ToListAsync();

    return Results.Ok(wishes);
})
.WithName("GetWishes")
.WithOpenApi();

app.MapGet("/api/wishes/random", async (BirthdayDbContext dbContext) =>
{
    var wishesCount = await dbContext.Wishes.CountAsync();

    if (wishesCount == 0)
    {
        return Results.NotFound(new
        {
            success = false,
            message = "No wishes are available yet."
        });
    }

    var skip = Random.Shared.Next(wishesCount);
    var wish = await dbContext.Wishes
        .OrderBy(wish => wish.Id)
        .Skip(skip)
        .Select(wish => new
        {
            wish.Id,
            wish.FriendName,
            wish.WishMessage
        })
        .FirstAsync();

    return Results.Ok(wish);
})
.WithName("GetRandomWish")
.WithOpenApi();

app.MapDelete("/api/wishes/{id:int}", async (
    int id,
    BirthdayDbContext dbContext,
    ILogger<Program> logger) =>
{
    var wish = await dbContext.Wishes.FindAsync(id);

    if (wish is null)
    {
        return Results.NotFound(new
        {
            success = false,
            message = "Wish not found."
        });
    }

    dbContext.Wishes.Remove(wish);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Wish {WishId} deleted.", id);

    return Results.NoContent();
})
.WithName("DeleteWish")
.WithOpenApi();

app.Run();

static Dictionary<string, string[]> ValidateCreateWishRequest(CreateWishRequest request)
{
    var errors = new Dictionary<string, string[]>();
    var friendName = request.NormalizedFriendName;
    var wishMessage = request.NormalizedWishMessage;

    if (friendName.Length < 2 || friendName.Length > 30)
    {
        errors["friendName"] = ["Friend name must be between 2 and 30 characters."];
    }

    if (wishMessage.Length < 5 || wishMessage.Length > 300)
    {
        errors["wishMessage"] = ["Wish message must be between 5 and 300 characters."];
    }

    return errors;
}
