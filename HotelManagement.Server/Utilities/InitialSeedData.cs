using HotelManagement.DataAccess;
using HotelManagement.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Server
{
    public static class InitialSeedData
    {
        public static async Task InitializeAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var context = services.GetRequiredService<BookingContext>();

            // Create roles
            string[] roles = { "Admin", "Manager", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }

            // --- Seed Users ---
            await SeedUser(userManager, "admin@pulseos.com", "Admin123!", "Admin User", "Admin");
            await SeedUser(userManager, "manager@pulseos.com", "Manager123!", "Maria Papadopoulou", "Manager");
            await SeedUser(userManager, "staff@pulseos.com", "Staff123!", "Nikos Stavros", "User");

            // --- Seed Apartments ---
            if (!await context.Apartments.AnyAsync())
            {
                var apartments = new[]
                {
                    new Apartment
                    {
                        Name = "Azure Seaside Villa",
                        Location = "Chania, Crete",
                        Description = "Stunning beachfront villa with private pool and panoramic sea views.",
                        MaxGuests = 6,
                        PricePerNight = 220,
                        CleaningFee = 80,
                        Currency = "EUR",
                        Bedrooms = 3,
                        Bathrooms = 2,
                        AreaSqMeters = 140,
                        PropertyType = "Villa",
                        Amenities = "[\"WiFi\",\"AC\",\"Pool\",\"Parking\",\"Kitchen\",\"Sea View\",\"BBQ\",\"Garden\"]",
                        DoorCode = "4821",
                        WifiSsid = "Azure-Villa",
                        WifiPassword = "seaside2024",
                        CheckInHour = 15,
                        CheckOutHour = 11,
                        Address = "Kalamaki Beach Road 12",
                        City = "Chania",
                        PostalCode = "73100",
                        Country = "Greece",
                        IsActive = true,
                        HouseRules = "No smoking indoors. Quiet hours 23:00-08:00. Max 6 guests.",
                        CheckInInstructions = "Key lockbox at the front gate. Code: 4821. Welcome basket on the kitchen counter.",
                    },
                    new Apartment
                    {
                        Name = "Sunset Studio",
                        Location = "Heraklion, Crete",
                        Description = "Cozy modern studio in the heart of Heraklion, walking distance to everything.",
                        MaxGuests = 2,
                        PricePerNight = 75,
                        CleaningFee = 30,
                        Currency = "EUR",
                        Bedrooms = 1,
                        Bathrooms = 1,
                        AreaSqMeters = 35,
                        PropertyType = "Studio",
                        Amenities = "[\"WiFi\",\"AC\",\"Kitchen\",\"TV\",\"Washer\"]",
                        DoorCode = "1234",
                        WifiSsid = "SunsetStudio",
                        WifiPassword = "sunset2024",
                        CheckInHour = 14,
                        CheckOutHour = 11,
                        Address = "25is Avgoustou 45",
                        City = "Heraklion",
                        PostalCode = "71202",
                        Country = "Greece",
                        IsActive = true,
                    },
                    new Apartment
                    {
                        Name = "Olive Garden Suite",
                        Location = "Rethymno, Crete",
                        Description = "Elegant suite surrounded by olive groves with mountain views.",
                        MaxGuests = 4,
                        PricePerNight = 150,
                        CleaningFee = 50,
                        Currency = "EUR",
                        Bedrooms = 2,
                        Bathrooms = 1,
                        AreaSqMeters = 85,
                        PropertyType = "Suite",
                        Amenities = "[\"WiFi\",\"AC\",\"Parking\",\"Kitchen\",\"Garden\",\"Balcony\",\"Fireplace\"]",
                        DoorCode = "9876",
                        WifiSsid = "OliveGarden-Guest",
                        WifiPassword = "olives2024",
                        CheckInHour = 15,
                        CheckOutHour = 10,
                        Address = "Arkadi Road 78",
                        City = "Rethymno",
                        PostalCode = "74100",
                        Country = "Greece",
                        IsActive = true,
                        HouseRules = "Pets welcome. No parties. Respect the olive trees.",
                    },
                    new Apartment
                    {
                        Name = "Harbor View Apartment",
                        Location = "Agios Nikolaos, Crete",
                        Description = "Modern 2-bedroom apartment overlooking the harbor and lake.",
                        MaxGuests = 4,
                        PricePerNight = 120,
                        CleaningFee = 40,
                        Currency = "EUR",
                        Bedrooms = 2,
                        Bathrooms = 2,
                        AreaSqMeters = 75,
                        PropertyType = "Apartment",
                        Amenities = "[\"WiFi\",\"AC\",\"Kitchen\",\"TV\",\"Balcony\",\"Sea View\",\"Washer\"]",
                        DoorCode = "5555",
                        WifiSsid = "HarborView",
                        WifiPassword = "harbor2024",
                        CheckInHour = 15,
                        CheckOutHour = 11,
                        Address = "Akti Koundourou 22",
                        City = "Agios Nikolaos",
                        PostalCode = "72100",
                        Country = "Greece",
                        IsActive = true,
                    },
                    new Apartment
                    {
                        Name = "Mountain Retreat",
                        Location = "Lasithi Plateau",
                        Description = "Traditional stone house with modern amenities in the mountains.",
                        MaxGuests = 5,
                        PricePerNight = 95,
                        CleaningFee = 35,
                        Currency = "EUR",
                        Bedrooms = 2,
                        Bathrooms = 1,
                        AreaSqMeters = 90,
                        PropertyType = "House",
                        Amenities = "[\"WiFi\",\"Parking\",\"Kitchen\",\"Fireplace\",\"Garden\",\"BBQ\"]",
                        DoorCode = "7777",
                        WifiSsid = "MountainRetreat",
                        WifiPassword = "mountain2024",
                        CheckInHour = 16,
                        CheckOutHour = 11,
                        Address = "Tzermiado Village",
                        City = "Lasithi",
                        PostalCode = "72052",
                        Country = "Greece",
                        IsActive = true,
                        HouseRules = "Firewood provided. No smoking. Hiking trails from the doorstep.",
                    },
                    new Apartment
                    {
                        Name = "Luxury Penthouse",
                        Location = "Elounda, Crete",
                        Description = "Premium penthouse with infinity pool and butler service.",
                        MaxGuests = 4,
                        PricePerNight = 450,
                        CleaningFee = 120,
                        Currency = "EUR",
                        Bedrooms = 2,
                        Bathrooms = 2,
                        AreaSqMeters = 160,
                        PropertyType = "Suite",
                        Amenities = "[\"WiFi\",\"AC\",\"Pool\",\"Parking\",\"Kitchen\",\"Sea View\",\"TV\",\"Balcony\",\"Washer\"]",
                        DoorCode = "0001",
                        WifiSsid = "Elounda-Penthouse",
                        WifiPassword = "luxury2024",
                        CheckInHour = 14,
                        CheckOutHour = 12,
                        Address = "Elounda Bay 1",
                        City = "Elounda",
                        PostalCode = "72053",
                        Country = "Greece",
                        IsActive = true,
                    },
                    new Apartment
                    {
                        Name = "Old Town Loft",
                        Location = "Chania Old Town",
                        Description = "Charming renovated loft in the Venetian quarter. Steps from the lighthouse.",
                        MaxGuests = 3,
                        PricePerNight = 110,
                        CleaningFee = 35,
                        Currency = "EUR",
                        Bedrooms = 1,
                        Bathrooms = 1,
                        AreaSqMeters = 55,
                        PropertyType = "Apartment",
                        Amenities = "[\"WiFi\",\"AC\",\"Kitchen\",\"TV\",\"Washer\"]",
                        DoorCode = "3333",
                        WifiSsid = "OldTownLoft",
                        WifiPassword = "venetian2024",
                        CheckInHour = 15,
                        CheckOutHour = 11,
                        Address = "Zambeliou 18",
                        City = "Chania",
                        PostalCode = "73131",
                        Country = "Greece",
                        IsActive = true,
                    },
                };

                context.Apartments.AddRange(apartments);
                await context.SaveChangesAsync();

                // --- Seed Bookings ---
                var now = DateTime.UtcNow;
                var savedApartments = await context.Apartments.ToListAsync();

                var bookings = new List<Booking>();

                // Active booking (currently staying) - Azure Villa
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[0].Id,
                    CheckInDate = now.AddDays(-2),
                    CheckOutDate = now.AddDays(5),
                    GuestFirstName = "James",
                    GuestLastName = "Wilson",
                    GuestEmail = "james.wilson@gmail.com",
                    GuestPhone = "+44 7911 123456",
                    NumberOfGuests = 4,
                    GuestCountry = "United Kingdom",
                    PricePerNight = 220,
                    NumberOfNights = 7,
                    CleaningFee = 80,
                    TotalPrice = 220 * 7 + 80,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "Card",
                    PlatformSource = "Airbnb",
                    PlatformReservationId = "ABB-2024-78291",
                    Status = "CheckedIn",
                    CheckedInAt = now.AddDays(-2).AddHours(16),
                });

                // Active booking - Sunset Studio
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[1].Id,
                    CheckInDate = now.AddDays(-1),
                    CheckOutDate = now.AddDays(3),
                    GuestFirstName = "Sophie",
                    GuestLastName = "Martin",
                    GuestEmail = "sophie.m@outlook.com",
                    GuestPhone = "+33 6 12 34 56 78",
                    NumberOfGuests = 2,
                    GuestCountry = "France",
                    PricePerNight = 75,
                    NumberOfNights = 4,
                    CleaningFee = 30,
                    TotalPrice = 75 * 4 + 30,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "Online",
                    PlatformSource = "Booking.com",
                    PlatformReservationId = "BDC-9182736",
                    Status = "CheckedIn",
                    CheckedInAt = now.AddDays(-1).AddHours(15),
                });

                // Upcoming booking - Olive Garden
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[2].Id,
                    CheckInDate = now.AddDays(3),
                    CheckOutDate = now.AddDays(10),
                    GuestFirstName = "Hans",
                    GuestLastName = "Mueller",
                    GuestEmail = "hans.mueller@web.de",
                    GuestPhone = "+49 151 12345678",
                    NumberOfGuests = 3,
                    GuestCountry = "Germany",
                    PricePerNight = 150,
                    NumberOfNights = 7,
                    CleaningFee = 50,
                    TotalPrice = 150 * 7 + 50,
                    Currency = "EUR",
                    IsPaid = false,
                    PlatformSource = "Direct",
                    Status = "Confirmed",
                    Notes = "Guest requested late check-in at 18:00",
                });

                // Upcoming booking - Harbor View
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[3].Id,
                    CheckInDate = now.AddDays(1),
                    CheckOutDate = now.AddDays(4),
                    GuestFirstName = "Elena",
                    GuestLastName = "Rossi",
                    GuestEmail = "elena.rossi@gmail.com",
                    GuestPhone = "+39 333 1234567",
                    NumberOfGuests = 2,
                    GuestCountry = "Italy",
                    PricePerNight = 120,
                    NumberOfNights = 3,
                    CleaningFee = 40,
                    TotalPrice = 120 * 3 + 40,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "Card",
                    PlatformSource = "Airbnb",
                    PlatformReservationId = "ABB-2024-91827",
                    Status = "Confirmed",
                });

                // Past booking - Luxury Penthouse
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[5].Id,
                    CheckInDate = now.AddDays(-14),
                    CheckOutDate = now.AddDays(-7),
                    GuestFirstName = "Alexander",
                    GuestLastName = "Petrov",
                    GuestEmail = "alex.petrov@mail.ru",
                    GuestPhone = "+7 916 1234567",
                    NumberOfGuests = 2,
                    GuestCountry = "Russia",
                    PricePerNight = 450,
                    NumberOfNights = 7,
                    CleaningFee = 120,
                    TotalPrice = 450 * 7 + 120,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "BankTransfer",
                    PlatformSource = "Direct",
                    Status = "CheckedOut",
                    CheckedInAt = now.AddDays(-14).AddHours(14),
                    CheckedOutAt = now.AddDays(-7).AddHours(11),
                });

                // Past booking - Old Town Loft
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[6].Id,
                    CheckInDate = now.AddDays(-5),
                    CheckOutDate = now.AddDays(-2),
                    GuestFirstName = "Anna",
                    GuestLastName = "Kowalska",
                    GuestEmail = "anna.k@wp.pl",
                    GuestPhone = "+48 501 234 567",
                    NumberOfGuests = 2,
                    GuestCountry = "Poland",
                    PricePerNight = 110,
                    NumberOfNights = 3,
                    CleaningFee = 35,
                    TotalPrice = 110 * 3 + 35,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "Online",
                    PlatformSource = "Booking.com",
                    PlatformReservationId = "BDC-5647382",
                    Status = "CheckedOut",
                    CheckedInAt = now.AddDays(-5).AddHours(15),
                    CheckedOutAt = now.AddDays(-2).AddHours(10),
                });

                // Upcoming booking - Mountain Retreat
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[4].Id,
                    CheckInDate = now.AddDays(7),
                    CheckOutDate = now.AddDays(14),
                    GuestFirstName = "Yuki",
                    GuestLastName = "Tanaka",
                    GuestEmail = "yuki.tanaka@yahoo.co.jp",
                    GuestPhone = "+81 90 1234 5678",
                    NumberOfGuests = 3,
                    GuestCountry = "Japan",
                    PricePerNight = 95,
                    NumberOfNights = 7,
                    CleaningFee = 35,
                    TotalPrice = 95 * 7 + 35,
                    Currency = "EUR",
                    IsPaid = false,
                    PlatformSource = "Airbnb",
                    PlatformReservationId = "ABB-2024-44556",
                    Status = "Confirmed",
                    Notes = "Family with small child. Needs high chair.",
                });

                // Cancelled booking - Azure Villa
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[0].Id,
                    CheckInDate = now.AddDays(10),
                    CheckOutDate = now.AddDays(15),
                    GuestFirstName = "Carlos",
                    GuestLastName = "Garcia",
                    GuestEmail = "carlos.garcia@gmail.com",
                    GuestPhone = "+34 612 345 678",
                    NumberOfGuests = 5,
                    GuestCountry = "Spain",
                    PricePerNight = 220,
                    NumberOfNights = 5,
                    CleaningFee = 80,
                    TotalPrice = 220 * 5 + 80,
                    Currency = "EUR",
                    IsPaid = false,
                    PlatformSource = "VRBO",
                    Status = "Cancelled",
                });

                // Future booking - Sunset Studio
                bookings.Add(new Booking
                {
                    ApartmentId = savedApartments[1].Id,
                    CheckInDate = now.AddDays(8),
                    CheckOutDate = now.AddDays(12),
                    GuestFirstName = "Dimitris",
                    GuestLastName = "Papadakis",
                    GuestEmail = "dim.papadakis@gmail.com",
                    GuestPhone = "+30 694 1234567",
                    NumberOfGuests = 1,
                    GuestCountry = "Greece",
                    PricePerNight = 75,
                    NumberOfNights = 4,
                    CleaningFee = 30,
                    TotalPrice = 75 * 4 + 30,
                    Currency = "EUR",
                    IsPaid = true,
                    PaymentMethod = "Cash",
                    PlatformSource = "Direct",
                    Status = "Confirmed",
                    Notes = "Returning guest. Prefers room on quiet side.",
                });

                context.Bookings.AddRange(bookings);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedUser(UserManager<ApplicationUser> userManager, string email, string password, string fullName, string role)
        {
            if (await userManager.FindByEmailAsync(email) != null) return;

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                FullName = fullName,
                RegisteredAt = DateTime.UtcNow,
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }
    }
}
