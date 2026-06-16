using System;

namespace HotelManagement.Models
{
    public class UpdateBookingDto
    {
        public Guid Id { get; set; }
        public Guid ApartmentId { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public string? GuestFirstName { get; set; }
        public string? GuestLastName { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestPhone { get; set; }
        public int NumberOfGuests { get; set; }
        public string? GuestCountry { get; set; }

        public decimal PricePerNight { get; set; }
        public decimal CleaningFee { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Currency { get; set; }
        public bool IsPaid { get; set; }
        public string? PaymentMethod { get; set; }

        public string? PlatformSource { get; set; }
        public string? PlatformReservationId { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }
}
