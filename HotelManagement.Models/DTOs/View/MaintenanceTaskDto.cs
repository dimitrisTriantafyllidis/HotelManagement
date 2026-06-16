namespace HotelManagement.Models.DTOs.View
{
    public class MaintenanceTaskDto
    {
        public Guid Id { get; set; }
        public Guid ApartmentId { get; set; }
        public string? ApartmentName { get; set; }
        public Guid? BookingId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string TaskType { get; set; } = "Cleaning";
        public string Status { get; set; } = "Todo";
        public string? AssignedTo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? PhotoProofUrl { get; set; }
        public string? CompletionNotes { get; set; }
    }
}
