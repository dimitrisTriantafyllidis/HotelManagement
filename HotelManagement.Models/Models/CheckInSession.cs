using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models.Models
{
    public class CheckInSession
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BookingId { get; set; }
        public Booking? Booking { get; set; }

        // ID verification
        public bool IsVerified { get; set; }
        public string? IdDocumentUrl { get; set; }
        public string? SelfieUrl { get; set; }

        // Binary file storage
        public byte[]? IdDocumentBlob { get; set; }
        public string? IdDocumentContentType { get; set; }
        public byte[]? SelfieBlob { get; set; }
        public string? SelfieContentType { get; set; }

        // Personal info
        public string? FatherName { get; set; }
        public string? MotherName { get; set; }
        public string? IdentityNo { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; }
        public string? CountryOfOrigin { get; set; }
        public string? Address { get; set; }

        // Terms acceptance
        public bool HasSignedTerms { get; set; }
        public byte[]? SignatureBlob { get; set; }

        // PDF
        public byte[]? PdfBlob { get; set; }

        // Admin approval
        public bool IsAdminApproved { get; set; }
        public DateTime? AdminApprovedAt { get; set; }
        public string? AdminNotes { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? VerifiedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
