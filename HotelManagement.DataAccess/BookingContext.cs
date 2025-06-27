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
        }
    }
}
