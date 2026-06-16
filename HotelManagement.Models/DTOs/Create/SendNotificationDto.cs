namespace HotelManagement.Models.DTOs.Create
{
    public class SendNotificationDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool SendEmail { get; set; } = true;
        public bool SendSms { get; set; } = false;
    }
}
