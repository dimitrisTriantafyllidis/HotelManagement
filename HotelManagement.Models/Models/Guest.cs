public class Guest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? FullName { get; set; }
    public string? PassportNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public byte[]? FileBlob { get; set; }
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
}