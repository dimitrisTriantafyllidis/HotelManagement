using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models.DTOs.Create;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using HotelManagement.Server.Services;
using HotelManagement.Server.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CheckInSessionsController : ControllerBase
    {
        private readonly BookingContext _context;
        private readonly IMapper _mapper;
        private readonly IPdfService _pdfService;
        private readonly IEmailService _emailService;

        public CheckInSessionsController(
            BookingContext context,
            IMapper mapper,
            IPdfService pdfService,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _pdfService = pdfService;
            _emailService = emailService;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CheckInSessionDto>> Get(Guid id)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        [HttpGet("by-booking/{bookingId}")]
        [AllowAnonymous]
        public async Task<ActionResult<CheckInSessionDto>> GetByBooking(Guid bookingId)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                .FirstOrDefaultAsync(s => s.BookingId == bookingId);

            if (session == null) return NotFound();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        /// <summary>
        /// Lists all pending check-in sessions awaiting admin approval.
        /// </summary>
        [HttpGet("pending")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<List<CheckInSessionDto>>> GetPending()
        {
            var sessions = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .Where(s => s.IsVerified && !s.IsAdminApproved)
                .OrderByDescending(s => s.VerifiedAt)
                .ToListAsync();

            return Ok(_mapper.Map<List<CheckInSessionDto>>(sessions));
        }

        /// <summary>
        /// Lists all check-in sessions (admin view).
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<List<CheckInSessionDto>>> GetAll()
        {
            var sessions = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(_mapper.Map<List<CheckInSessionDto>>(sessions));
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create(CreateCheckInSessionDto dto)
        {
            var booking = await _context.Bookings.FindAsync(dto.BookingId);
            if (booking == null) return BadRequest("Booking not found.");

            var existing = await _context.CheckInSessions
                .FirstOrDefaultAsync(s => s.BookingId == dto.BookingId);
            if (existing != null) return BadRequest("Check-in session already exists for this booking.");

            var entity = _mapper.Map<CheckInSession>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            _context.CheckInSessions.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<CheckInSessionDto>(entity));
        }

        /// <summary>
        /// Updates the session with signature data and marks terms as signed.
        /// Called by the guest after drawing their signature.
        /// </summary>
        [HttpPut("{id}/sign")]
        [AllowAnonymous]
        public async Task<IActionResult> Sign(Guid id, [FromBody] SignTermsDto dto)
        {
            var session = await _context.CheckInSessions.FindAsync(id);
            if (session == null) return NotFound();

            if (string.IsNullOrEmpty(dto.SignatureData))
                return BadRequest("Signature is required.");

            session.HasSignedTerms = true;
            session.SignatureBlob = Convert.FromBase64String(
                dto.SignatureData.Replace("data:image/png;base64,", ""));

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        /// <summary>
        /// Guest submits check-in for verification. Marks session as verified (guest-side complete).
        /// Admin must still approve before door code is released.
        /// </summary>
        [HttpPut("{id}/verify")]
        [AllowAnonymous]
        public async Task<IActionResult> Verify(Guid id)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            var hasIdDoc = session.IdDocumentBlob != null || !string.IsNullOrEmpty(session.IdDocumentUrl);
            var hasSelfie = session.SelfieBlob != null || !string.IsNullOrEmpty(session.SelfieUrl);
            if (!hasIdDoc || !hasSelfie)
                return BadRequest("ID document and selfie are required before verification.");

            if (!session.HasSignedTerms)
                return BadRequest("Terms must be signed before verification.");

            session.IsVerified = true;
            session.VerifiedAt = DateTime.UtcNow;

            var booking = session.Booking;
            if (booking != null)
                booking.Status = "PendingApproval";

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        /// <summary>
        /// Admin approves the check-in session. Generates PDF, sends email, and enables door code access.
        /// </summary>
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Approve(Guid id, [FromBody] AdminApprovalDto? dto)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            if (!session.IsVerified)
                return BadRequest("Session must be verified by guest before admin approval.");

            session.IsAdminApproved = true;
            session.AdminApprovedAt = DateTime.UtcNow;
            session.AdminNotes = dto?.Notes;
            session.CompletedAt = DateTime.UtcNow;

            var booking = session.Booking;
            if (booking != null)
                booking.Status = "CheckedIn";

            // Generate PDF and store on session
            if (booking != null)
            {
                var language = dto?.Language ?? "en";
                var pdfBytes = _pdfService.GenerateCheckInPdf(booking, session, language);
                session.PdfBlob = pdfBytes;

                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailService.SendCheckInConfirmationAsync(booking, session, pdfBytes);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Email send failed: {ex.Message}");
                    }
                });
            }

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        /// <summary>
        /// Admin rejects the check-in session.
        /// </summary>
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Reject(Guid id, [FromBody] AdminApprovalDto? dto)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            session.IsAdminApproved = false;
            session.AdminNotes = dto?.Notes ?? "Rejected by admin.";
            session.IsVerified = false;
            session.VerifiedAt = null;

            var booking = session.Booking;
            if (booking != null)
                booking.Status = "Rejected";

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CheckInSessionDto>(session));
        }

        [HttpGet("{id}/pdf")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DownloadPdf(Guid id, [FromQuery] string language = "en")
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();
            if (session.Booking == null) return NotFound("Booking not found.");

            // Always regenerate with requested language
            var pdfBytes = _pdfService.GenerateCheckInPdf(session.Booking, session, language);
            return File(pdfBytes, "application/pdf", $"CheckIn_{session.BookingId}_{language}.pdf");
        }

        // ── File upload/download endpoints ──

        [HttpPost("{id}/id-document")]
        [AllowAnonymous]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadIdDocument(Guid id, [FromForm] IFormFile file)
        {
            var session = await _context.CheckInSessions.FindAsync(id);
            if (session == null) return NotFound();

            if (!FileValidation.IsValidImage(file))
                return BadRequest("Invalid file. Only JPEG, PNG, WebP up to 5MB.");

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            session.IdDocumentBlob = ms.ToArray();
            session.IdDocumentContentType = file.ContentType;

            await _context.SaveChangesAsync();
            return Ok(new { message = "ID document uploaded." });
        }

        [HttpPost("{id}/selfie")]
        [AllowAnonymous]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadSelfie(Guid id, [FromForm] IFormFile file)
        {
            var session = await _context.CheckInSessions.FindAsync(id);
            if (session == null) return NotFound();

            if (!FileValidation.IsValidImage(file))
                return BadRequest("Invalid file. Only JPEG, PNG, WebP up to 5MB.");

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            session.SelfieBlob = ms.ToArray();
            session.SelfieContentType = file.ContentType;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Selfie uploaded." });
        }

        [HttpGet("{id}/id-document")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DownloadIdDocument(Guid id)
        {
            var session = await _context.CheckInSessions.FindAsync(id);
            if (session == null) return NotFound();

            if (session.IdDocumentBlob == null || session.IdDocumentBlob.Length == 0)
                return NotFound("No ID document uploaded.");

            return File(session.IdDocumentBlob, session.IdDocumentContentType ?? "image/jpeg", $"id_document_{id}.jpg");
        }

        [HttpGet("{id}/selfie")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DownloadSelfie(Guid id)
        {
            var session = await _context.CheckInSessions.FindAsync(id);
            if (session == null) return NotFound();

            if (session.SelfieBlob == null || session.SelfieBlob.Length == 0)
                return NotFound("No selfie uploaded.");

            return File(session.SelfieBlob, session.SelfieContentType ?? "image/jpeg", $"selfie_{id}.jpg");
        }

        /// <summary>
        /// Secure door code gate: only returns property access credentials
        /// if the check-in session is verified, admin-approved, AND current time is post-check-in.
        /// </summary>
        [HttpGet("{id}/door-code")]
        [AllowAnonymous]
        public async Task<ActionResult<DoorCodeResponseDto>> GetDoorCode(Guid id)
        {
            var session = await _context.CheckInSessions
                .Include(s => s.Booking)
                    .ThenInclude(b => b!.Apartment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            if (!session.IsVerified)
                return BadRequest("Check-in verification is not complete.");

            if (!session.IsAdminApproved)
                return BadRequest("Check-in is pending administrator approval.");

            var booking = session.Booking;
            var apartment = booking?.Apartment;
            if (booking == null || apartment == null)
                return NotFound("Booking or apartment not found.");

            var checkInTime = booking.CheckInDate.Date.AddHours(apartment.CheckInHour);
            if (DateTime.UtcNow < checkInTime)
                return BadRequest($"Door code available after {checkInTime:g} UTC.");

            return Ok(new DoorCodeResponseDto
            {
                DoorCode = apartment.DoorCode,
                WifiSsid = apartment.WifiSsid,
                WifiPassword = apartment.WifiPassword,
                ApartmentName = apartment.Name
            });
        }
    }

    public class SignTermsDto
    {
        public string? SignatureData { get; set; }
    }

    public class AdminApprovalDto
    {
        public string? Notes { get; set; }
        public string? Language { get; set; }
    }
}
