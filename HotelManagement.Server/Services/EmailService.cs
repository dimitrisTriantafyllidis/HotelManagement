using HotelManagement.Models.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace HotelManagement.Server.Services
{
    public interface IEmailService
    {
        Task SendCheckInConfirmationAsync(Booking booking, CheckInSession session, byte[] pdfBytes);
        Task SendNotificationAsync(string email, string recipientName, string subject, string htmlBody, byte[]? pdfAttachment = null);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendCheckInConfirmationAsync(Booking booking, CheckInSession session, byte[] pdfBytes)
        {
            var guestName = $"{booking.GuestFirstName} {booking.GuestLastName}".Trim();
            var subject = $"Check-In Confirmation - {guestName}";
            var htmlBody = $@"
                <h2>Check-In Confirmation</h2>
                <p>Dear {guestName},</p>
                <p>Your online check-in has been completed successfully.</p>
                <table style='border-collapse:collapse;'>
                    <tr><td style='padding:4px 12px;font-weight:bold;'>Booking ID</td><td style='padding:4px 12px;'>{booking.Id}</td></tr>
                    <tr><td style='padding:4px 12px;font-weight:bold;'>Check-In</td><td style='padding:4px 12px;'>{booking.CheckInDate:yyyy-MM-dd}</td></tr>
                    <tr><td style='padding:4px 12px;font-weight:bold;'>Check-Out</td><td style='padding:4px 12px;'>{booking.CheckOutDate:yyyy-MM-dd}</td></tr>
                    <tr><td style='padding:4px 12px;font-weight:bold;'>Nationality</td><td style='padding:4px 12px;'>{session.Nationality ?? "-"}</td></tr>
                </table>
                <p>Please find your check-in details attached as a PDF.</p>
                <p>We wish you a pleasant stay!</p>
                <p style='color:#888;font-size:12px;'>Hotel Management System</p>";

            if (string.IsNullOrEmpty(booking.GuestEmail))
            {
                _logger.LogWarning("No email recipients found for booking {BookingId}.", booking.Id);
                return;
            }

            await SendNotificationAsync(booking.GuestEmail, guestName, subject, htmlBody, pdfBytes);
            _logger.LogInformation("Check-in confirmation email sent for booking {BookingId}.", booking.Id);
        }

        public async Task SendNotificationAsync(string email, string recipientName, string subject, string htmlBody, byte[]? pdfAttachment = null)
        {
            var smtp = _config.GetSection("SmtpSettings");
            var host = smtp["Host"];
            var port = int.Parse(smtp["Port"] ?? "587");
            var senderEmail = smtp["SenderEmail"];
            var senderName = smtp["SenderName"] ?? "Hotel Management";
            var password = smtp["Password"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("SMTP settings not configured. Skipping notification email.");
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = subject;

            var body = new TextPart("html") { Text = htmlBody };

            if (pdfAttachment != null && pdfAttachment.Length > 0)
            {
                var attachment = new MimePart("application", "pdf")
                {
                    Content = new MimeContent(new MemoryStream(pdfAttachment)),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = "notification.pdf"
                };
                message.Body = new Multipart("mixed") { body, attachment };
            }
            else
            {
                message.Body = body;
            }

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(senderEmail, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Notification email sent to {Email}.", email);
        }
    }
}
