using BirthdayBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace BirthdayBackend.Data;

public sealed class BirthdayDbContext(DbContextOptions<BirthdayDbContext> options) : DbContext(options)
{
    public DbSet<Wish> Wishes => Set<Wish>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Wish>(entity =>
        {
            entity.ToTable("Wishes");

            entity.HasKey(wish => wish.Id);

            entity.Property(wish => wish.Id)
                .ValueGeneratedOnAdd();

            entity.Property(wish => wish.FriendName)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(wish => wish.WishMessage)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(wish => wish.CreatedAt)
                .IsRequired();
        });
    }
}
