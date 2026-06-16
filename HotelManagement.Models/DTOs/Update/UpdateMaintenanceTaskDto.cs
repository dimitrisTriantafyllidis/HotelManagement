namespace HotelManagement.Models.DTOs.Update
{
    public class UpdateMaintenanceTaskDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = "Todo";
        public string? AssignedTo { get; set; }
        public string? PhotoProofUrl { get; set; }
        public string? CompletionNotes { get; set; }
    }
}
