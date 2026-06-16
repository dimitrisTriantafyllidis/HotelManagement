using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models.Models
{
    public class MaintenanceTask
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ApartmentId { get; set; }
        public Apartment? Apartment { get; set; }

        public Guid? BookingId { get; set; }
        public Booking? Booking { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }
        public string TaskType { get; set; } = "Cleaning"; // Cleaning, Repair, Inspection
        public string Status { get; set; } = "Todo"; // Todo, InProgress, Done
        public string? AssignedTo { get; set; } // Cleaner/staff name

        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        // Photo proof of completion
        public string? PhotoProofUrl { get; set; }
        public string? CompletionNotes { get; set; }
    }
}
