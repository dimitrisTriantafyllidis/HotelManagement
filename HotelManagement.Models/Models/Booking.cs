using HotelManagement.Models.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApartmentId { get; set; }
    public Apartment? Apartment { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }

    public ICollection<Guest>? Guests { get; set; }
    public OnlineCheckIn? CheckIn { get; set; }
}