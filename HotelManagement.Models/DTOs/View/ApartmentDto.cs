using System;
using System.Collections.Generic;

namespace HotelManagement.Models
{
    public class ApartmentDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public int MaxGuests { get; set; }

        public decimal PricePerNight { get; set; }
        public decimal? CleaningFee { get; set; }
        public string? Currency { get; set; }

        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public double? AreaSqMeters { get; set; }
        public string? PropertyType { get; set; }
        public string? Amenities { get; set; }
        public string? PhotoUrls { get; set; }

        public string? DoorCode { get; set; }
        public string? WifiSsid { get; set; }
        public string? WifiPassword { get; set; }
        public int CheckInHour { get; set; }
        public int CheckOutHour { get; set; }

        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool IsActive { get; set; }
        public string? HouseRules { get; set; }
        public string? CheckInInstructions { get; set; }

        public List<BookingDto>? Bookings { get; set; }
    }
}
