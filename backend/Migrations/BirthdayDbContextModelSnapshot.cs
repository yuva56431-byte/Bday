using System;
using BirthdayBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BirthdayBackend.Migrations;

[DbContext(typeof(BirthdayDbContext))]
partial class BirthdayDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

        modelBuilder.Entity("BirthdayBackend.Models.Wish", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER");

            b.Property<DateTime>("CreatedAt")
                .HasColumnType("TEXT");

            b.Property<string>("FriendName")
                .IsRequired()
                .HasMaxLength(30)
                .HasColumnType("TEXT");

            b.Property<string>("WishMessage")
                .IsRequired()
                .HasMaxLength(300)
                .HasColumnType("TEXT");

            b.HasKey("Id");

            b.ToTable("Wishes");
        });
#pragma warning restore 612, 618
    }
}
