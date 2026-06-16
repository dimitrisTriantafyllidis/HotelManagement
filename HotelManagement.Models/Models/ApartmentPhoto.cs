using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models.Models
{
    public class ApartmentPhoto
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ApartmentId { get; set; }
        public Apartment? Apartment { get; set; }

        public byte[] Data { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; } = "image/jpeg";
        public string? FileName { get; set; }
        public int SortOrder { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
