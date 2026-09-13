using BirthdayBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace BirthdayBackend.Data;

public static class SeedData
{
    public static async Task InitializeAsync(BirthdayDbContext dbContext, ILogger logger)
    {
        await dbContext.Database.MigrateAsync();

        if (await dbContext.Wishes.AnyAsync())
        {
            logger.LogInformation("Database initialized. Existing wishes found, seed skipped.");
            return;
        }

        var createdAt = DateTime.UtcNow;
        var sampleWishes = new[]
        {
            new Wish
            {
                FriendName = "Priya",
                WishMessage = "Happy Birthday! May your day be filled with smiles and sweet little surprises.",
                CreatedAt = createdAt.AddMinutes(-5)
            },
            new Wish
            {
                FriendName = "Ananya",
                WishMessage = "Wishing you a year full of confidence, calm moments, and beautiful memories.",
                CreatedAt = createdAt.AddMinutes(-4)
            },
            new Wish
            {
                FriendName = "Meera",
                WishMessage = "Hope today reminds you how loved, appreciated, and special you are.",
                CreatedAt = createdAt.AddMinutes(-3)
            },
            new Wish
            {
                FriendName = "Kavya",
                WishMessage = "May this birthday bring happiness that stays with you all year.",
                CreatedAt = createdAt.AddMinutes(-2)
            },
            new Wish
            {
                FriendName = "Neha",
                WishMessage = "Keep smiling and keep shining. You deserve the loveliest birthday.",
                CreatedAt = createdAt.AddMinutes(-1)
            }
        };

        dbContext.Wishes.AddRange(sampleWishes);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Database initialized and seeded with {WishCount} sample wishes.", sampleWishes.Length);
    }
}
