using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models;
using HotelManagement.Models.DTOs.Create;
using HotelManagement.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotemManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : Controller
    {
        private readonly BookingContext _context;
        private readonly IMapper _mapper;
        private readonly IPdfService _pdfService;
        private readonly IEmailService _emailService;

        public BookingsController(BookingContext context, IMapper mapper, IPdfService pdfService, IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _pdfService = pdfService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
        {
            var items = await _context.Bookings
                .Include(b => b.Apartment)
                .Include(b => b.Guests)
                .Include(b => b.CheckIn)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<BookingDto>>(items));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> Get(Guid id)
        {
            var item = await _context.Bookings
                .Include(b => b.Apartment)
                .Include(b => b.Guests)
                .Include(b => b.CheckIn)
                .FirstOrDefaultAsync(b => b.Id == id);

            return item == null ? NotFound() : Ok(_mapper.Map<BookingDto>(item));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create(CreateBookingDto dto)
        {
            var entity = _mapper.Map<Booking>(dto);
            entity.NumberOfNights = Math.Max(1, (entity.CheckOutDate - entity.CheckInDate).Days);
            if (entity.TotalPrice == 0 && entity.PricePerNight > 0)
                entity.TotalPrice = entity.PricePerNight * entity.NumberOfNights + entity.CleaningFee;
            _context.Bookings.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<BookingDto>(entity));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Update(Guid id, UpdateBookingDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.Bookings
                .Include(b => b.Apartment)
                .FirstOrDefaultAsync(b => b.Id == id);
            if (entity == null) return NotFound();
            _mapper.Map(dto, entity);
            entity.NumberOfNights = Math.Max(1, (entity.CheckOutDate - entity.CheckInDate).Days);
            entity.TotalPrice = entity.PricePerNight * entity.NumberOfNights + entity.CleaningFee;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.Bookings.FindAsync(id);
            if (entity == null) return NotFound();
            _context.Bookings.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{id}/checkin-pdf")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DownloadCheckInPdf(Guid id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Apartment)
                .Include(b => b.CheckInSession)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return NotFound();
            if (booking.CheckInSession == null) return NotFound("No check-in session exists for this booking.");

            byte[] pdfBytes;
            if (booking.CheckInSession.PdfBlob != null && booking.CheckInSession.PdfBlob.Length > 0)
            {
                pdfBytes = booking.CheckInSession.PdfBlob;
            }
            else
            {
                pdfBytes = _pdfService.GenerateCheckInPdf(booking, booking.CheckInSession);
                booking.CheckInSession.PdfBlob = pdfBytes;
                await _context.SaveChangesAsync();
            }

            return File(pdfBytes, "application/pdf", $"CheckIn_{id}.pdf");
        }

        [HttpPost("{id}/notify")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SendNotification(Guid id, [FromBody] SendNotificationDto dto)
        {
            var booking = await _context.Bookings
                .Include(b => b.Apartment)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return NotFound();

            bool emailSent = false;
            if (dto.SendEmail && !string.IsNullOrEmpty(booking.GuestEmail))
            {
                var guestName = $"{booking.GuestFirstName} {booking.GuestLastName}".Trim();
                await _emailService.SendNotificationAsync(booking.GuestEmail, guestName, dto.Subject, dto.Message);
                emailSent = true;
            }

            return Ok(new { emailSent, smsSent = false });
        }
    }
}
