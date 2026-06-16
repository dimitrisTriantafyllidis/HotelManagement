namespace HotelManagement.Models.DTOs.View
{
    public class ApartmentPhotoDto
    {
        public Guid Id { get; set; }
        public Guid ApartmentId { get; set; }
        public string? FileName { get; set; }
        public string ContentType { get; set; } = "image/jpeg";
        public int SortOrder { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
