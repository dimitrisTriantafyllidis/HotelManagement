using HotelManagement.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.DataAccess
{
    public class BookingContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public BookingContext(DbContextOptions<BookingContext> options) : base(options) { }


            public DbSet<Apartment> Apartments { get; set; }
            public DbSet<Booking> Bookings { get; set; }
            public DbSet<Guest> Guests { get; set; }
            public DbSet<OnlineCheckIn> OnlineCheckInForms { get; set; }
            public DbSet<CheckInSession> CheckInSessions { get; set; }
            public DbSet<MaintenanceTask> MaintenanceTasks { get; set; }
            public DbSet<ApartmentPhoto> ApartmentPhotos { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<Booking>()
                    .HasOne(b => b.CheckIn)
                    .WithOne(f => f.Booking)
                    .HasForeignKey<OnlineCheckIn>(f => f.BookingId);

                modelBuilder.Entity<Booking>()
                    .HasMany(b => b.Guests)
                    .WithOne(g => g.Booking)
                    .HasForeignKey(g => g.BookingId);

                modelBuilder.Entity<Apartment>()
                    .HasMany(a => a.Bookings)
                    .WithOne(b => b.Apartment)
                    .HasForeignKey(b => b.ApartmentId);

                modelBuilder.Entity<Booking>()
                    .HasOne<ApplicationUser>()
                    .WithMany(u => u.Bookings)
                    .HasForeignKey("UserId")
                    .OnDelete(DeleteBehavior.SetNull);

                modelBuilder.Entity<Booking>()
                    .HasOne(b => b.CheckInSession)
                    .WithOne(c => c.Booking)
                    .HasForeignKey<CheckInSession>(c => c.BookingId);

                modelBuilder.Entity<Booking>()
                    .Property(b => b.TotalPrice)
                    .HasColumnType("decimal(18,2)");

                modelBuilder.Entity<Booking>()
                    .Property(b => b.PricePerNight)
                    .HasColumnType("decimal(18,2)");

                modelBuilder.Entity<Booking>()
                    .Property(b => b.CleaningFee)
                    .HasColumnType("decimal(18,2)");

                modelBuilder.Entity<Apartment>()
                    .Property(a => a.PricePerNight)
                    .HasColumnType("decimal(18,2)");

                modelBuilder.Entity<Apartment>()
                    .Property(a => a.CleaningFee)
                    .HasColumnType("decimal(18,2)");

                modelBuilder.Entity<Apartment>()
                    .HasMany(a => a.Photos)
                    .WithOne(p => p.Apartment)
                    .HasForeignKey(p => p.ApartmentId)
                    .OnDelete(DeleteBehavior.Cascade);

                modelBuilder.Entity<Apartment>()
                    .HasMany(a => a.MaintenanceTasks)
                    .WithOne(m => m.Apartment)
                    .HasForeignKey(m => m.ApartmentId)
                    .OnDelete(DeleteBehavior.NoAction);

                modelBuilder.Entity<MaintenanceTask>()
                    .HasOne(m => m.Booking)
                    .WithMany()
                    .HasForeignKey(m => m.BookingId)
                    .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
