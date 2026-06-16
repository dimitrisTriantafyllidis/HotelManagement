using HotelManagement.Models.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApartmentId { get; set; }
    public Apartment? Apartment { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }

    // Guest contact info
    public string? GuestFirstName { get; set; }
    public string? GuestLastName { get; set; }
    public string? GuestEmail { get; set; }
    public string? GuestPhone { get; set; }
    public int NumberOfGuests { get; set; } = 1;
    public string? GuestCountry { get; set; }

    // Pricing
    public decimal PricePerNight { get; set; }
    public int NumberOfNights { get; set; }
    public decimal CleaningFee { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Currency { get; set; } = "EUR";
    public bool IsPaid { get; set; }
    public string? PaymentMethod { get; set; } // Cash, Card, BankTransfer, Online

    // Platform
    public string? PlatformSource { get; set; } // "Airbnb", "Booking.com", "Direct", etc.
    public string? PlatformReservationId { get; set; }

    public string? Status { get; set; } = "Confirmed"; // Confirmed, CheckedIn, CheckedOut, Cancelled
    public string? Notes { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CheckedInAt { get; set; }
    public DateTime? CheckedOutAt { get; set; }

    public ICollection<Guest>? Guests { get; set; }
    public OnlineCheckIn? CheckIn { get; set; }
    public CheckInSession? CheckInSession { get; set; }
}
