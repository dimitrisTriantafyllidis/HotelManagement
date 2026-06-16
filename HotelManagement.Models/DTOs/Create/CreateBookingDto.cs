using HotelManagement.Models.DTOs.View;
using System;
using System.Collections.Generic;

namespace HotelManagement.Models
{
    public class CreateBookingDto
    {
        public Guid ApartmentId { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public string? GuestFirstName { get; set; }
        public string? GuestLastName { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestPhone { get; set; }
        public int NumberOfGuests { get; set; } = 1;
        public string? GuestCountry { get; set; }

        public decimal PricePerNight { get; set; }
        public decimal CleaningFee { get; set; }
        public string? Currency { get; set; } = "EUR";
        public string? PaymentMethod { get; set; }

        public string? PlatformSource { get; set; }
        public string? PlatformReservationId { get; set; }
        public string? Notes { get; set; }

        public List<GuestDto>? Guests { get; set; }
    }
}
