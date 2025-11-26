using System;
using Microsoft.EntityFrameworkCore;

namespace TodoApi
{
    public partial class ToDoDbContext : DbContext
    {
        public ToDoDbContext() { }

        public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
            : base(options) { }

        public virtual DbSet<Item> Items { get; set; }
        public virtual DbSet<User> Users { get; set; }

    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            // ✅ Items table
            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("Items");
                entity.HasKey(e => e.Id);        // חובה
                entity.Property(e => e.Name).HasMaxLength(100);
            });

            // ✅ Users table
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);        // חובה!
                entity.Property(e => e.UserName).HasMaxLength(50);
                entity.Property(e => e.Password).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
