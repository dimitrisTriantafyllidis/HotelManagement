using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models.Models
{
    public class Apartment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public int MaxGuests { get; set; }

        // Pricing
        public decimal PricePerNight { get; set; }
        public decimal? CleaningFee { get; set; }
        public string? Currency { get; set; } = "EUR";

        // Property details
        public int Bedrooms { get; set; } = 1;
        public int Bathrooms { get; set; } = 1;
        public double? AreaSqMeters { get; set; }
        public string? PropertyType { get; set; } // Apartment, Villa, Studio, Suite
        public string? Amenities { get; set; } // JSON array: ["WiFi","AC","Parking","Pool"]

        // Photos (JSON array of URLs)
        public string? PhotoUrls { get; set; }

        // Property access credentials
        public string? DoorCode { get; set; }
        public string? WifiSsid { get; set; }
        public string? WifiPassword { get; set; }

        // Check-in/out times (hour of day, e.g. 15 = 3 PM)
        public int CheckInHour { get; set; } = 15;
        public int CheckOutHour { get; set; } = 11;

        // Address details
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Status
        public bool IsActive { get; set; } = true;

        // House rules / instructions
        public string? HouseRules { get; set; }
        public string? CheckInInstructions { get; set; }

        public ICollection<Booking>? Bookings { get; set; }
        public ICollection<MaintenanceTask>? MaintenanceTasks { get; set; }
        public ICollection<ApartmentPhoto>? Photos { get; set; }
    }
}
