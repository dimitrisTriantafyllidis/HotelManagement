namespace HotelManagement.Models.DTOs.Create
{
    public class CreateMaintenanceTaskDto
    {
        public Guid ApartmentId { get; set; }
        public Guid? BookingId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string TaskType { get; set; } = "Cleaning";
        public string? AssignedTo { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
