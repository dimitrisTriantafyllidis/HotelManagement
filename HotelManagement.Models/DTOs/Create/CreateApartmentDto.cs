namespace HotelManagement.Models
{
    public class CreateApartmentDto
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public int MaxGuests { get; set; }

        public decimal PricePerNight { get; set; }
        public decimal? CleaningFee { get; set; }
        public string? Currency { get; set; } = "EUR";

        public int Bedrooms { get; set; } = 1;
        public int Bathrooms { get; set; } = 1;
        public double? AreaSqMeters { get; set; }
        public string? PropertyType { get; set; }
        public string? Amenities { get; set; }
        public string? PhotoUrls { get; set; }

        public string? DoorCode { get; set; }
        public string? WifiSsid { get; set; }
        public string? WifiPassword { get; set; }
        public int CheckInHour { get; set; } = 15;
        public int CheckOutHour { get; set; } = 11;

        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }

        public string? HouseRules { get; set; }
        public string? CheckInInstructions { get; set; }
    }
}
