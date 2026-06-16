namespace HotelManagement.Models.DTOs.Create
{
    public class CreateCheckInSessionDto
    {
        public Guid BookingId { get; set; }
        public string? IdDocumentUrl { get; set; }
        public string? SelfieUrl { get; set; }
        public bool HasSignedTerms { get; set; }
        public string? SignatureData { get; set; } // base64

        // Personal info
        public string? FatherName { get; set; }
        public string? MotherName { get; set; }
        public string? IdentityNo { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; }
        public string? CountryOfOrigin { get; set; }
        public string? Address { get; set; }
    }
}
