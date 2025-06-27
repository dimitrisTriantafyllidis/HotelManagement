using System.ComponentModel.DataAnnotations;

public class OnlineCheckIn
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string? FirstName { get; set; }

    [Required]
    public string? LastName { get; set; }

    public string? FatherName { get; set; }
    public string? MotherName { get; set; }

    [Required]
    public string? IdentityNo { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public string? Nationality { get; set; }
    public string?    CountryOfOrigin { get; set; }

    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }

    public string? Appartment { get; set; }

    public DateTime? DateOfArrival { get; set; }
    public DateTime? DateOfDeparture { get; set; }

    public bool Agree { get; set; }

    // Signature stored as binary (base64 string from frontend)
    public byte[]? SignatureBlob { get; set; }
    public byte[]? PdfFileBlob { get; set; }

    public DateTime? SubmittedAt { get; set; } = DateTime.UtcNow;

    public Guid? BookingId { get; set; }  // also acts as PK and FK

    public Booking? Booking { get; set; }
}