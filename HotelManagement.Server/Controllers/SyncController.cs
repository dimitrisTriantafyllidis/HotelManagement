using HotelManagement.DataAccess;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class SyncController : ControllerBase
    {
        private readonly BookingContext _context;

        public SyncController(BookingContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Ingest iCal feed from Airbnb/Booking.com and map events to the Bookings table.
        /// Expects a URL query param pointing to an iCal feed.
        /// </summary>
        [HttpPost("ical")]
        public async Task<ActionResult<SyncResultDto>> SyncIcal(
            [FromQuery] Guid apartmentId,
            [FromQuery] string feedUrl,
            [FromQuery] string platform = "Airbnb")
        {
            var apartment = await _context.Apartments.FindAsync(apartmentId);
            if (apartment == null) return BadRequest("Apartment not found.");

            var result = new SyncResultDto();

            try
            {
                using var httpClient = new HttpClient();
                var icalContent = await httpClient.GetStringAsync(feedUrl);
                var events = ParseIcalEvents(icalContent);

                foreach (var evt in events)
                {
                    var existing = await _context.Bookings.FirstOrDefaultAsync(b =>
                        b.ApartmentId == apartmentId &&
                        b.PlatformReservationId == evt.Uid &&
                        b.PlatformSource == platform);

                    if (existing != null)
                    {
                        existing.CheckInDate = evt.Start;
                        existing.CheckOutDate = evt.End;
                        existing.GuestFirstName = evt.Summary;
                        result.Updated++;
                    }
                    else
                    {
                        var booking = new Booking
                        {
                            ApartmentId = apartmentId,
                            CheckInDate = evt.Start,
                            CheckOutDate = evt.End,
                            GuestFirstName = evt.Summary,
                            PlatformSource = platform,
                            PlatformReservationId = evt.Uid,
                            Status = "Confirmed"
                        };
                        _context.Bookings.Add(booking);
                        result.Created++;
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                result.Errors.Add(ex.Message);
            }

            return Ok(result);
        }

        /// <summary>
        /// Ingest JSON feed of bookings (for custom integrations).
        /// </summary>
        [HttpPost("json")]
        public async Task<ActionResult<SyncResultDto>> SyncJson(
            [FromQuery] Guid apartmentId,
            [FromBody] List<JsonBookingImport> bookings)
        {
            var apartment = await _context.Apartments.FindAsync(apartmentId);
            if (apartment == null) return BadRequest("Apartment not found.");

            var result = new SyncResultDto();

            foreach (var item in bookings)
            {
                var existing = await _context.Bookings.FirstOrDefaultAsync(b =>
                    b.ApartmentId == apartmentId &&
                    b.PlatformReservationId == item.ReservationId &&
                    b.PlatformSource == item.Platform);

                if (existing != null)
                {
                    existing.CheckInDate = item.CheckIn;
                    existing.CheckOutDate = item.CheckOut;
                    existing.GuestFirstName = item.GuestFirstName;
                    existing.GuestLastName = item.GuestLastName;
                    existing.GuestEmail = item.GuestEmail;
                    existing.GuestPhone = item.GuestPhone;
                    existing.TotalPrice = item.TotalPrice;
                    result.Updated++;
                }
                else
                {
                    var booking = new Booking
                    {
                        ApartmentId = apartmentId,
                        CheckInDate = item.CheckIn,
                        CheckOutDate = item.CheckOut,
                        GuestFirstName = item.GuestFirstName,
                        GuestLastName = item.GuestLastName,
                        GuestEmail = item.GuestEmail,
                        GuestPhone = item.GuestPhone,
                        TotalPrice = item.TotalPrice,
                        PlatformSource = item.Platform,
                        PlatformReservationId = item.ReservationId,
                        Status = "Confirmed"
                    };
                    _context.Bookings.Add(booking);
                    result.Created++;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(result);
        }

        private static List<IcalEvent> ParseIcalEvents(string icalContent)
        {
            var events = new List<IcalEvent>();
            var eventBlocks = Regex.Split(icalContent, @"BEGIN:VEVENT");

            foreach (var block in eventBlocks.Skip(1))
            {
                var evt = new IcalEvent();

                var uidMatch = Regex.Match(block, @"UID:(.+)");
                if (uidMatch.Success) evt.Uid = uidMatch.Groups[1].Value.Trim();

                var summaryMatch = Regex.Match(block, @"SUMMARY:(.+)");
                if (summaryMatch.Success) evt.Summary = summaryMatch.Groups[1].Value.Trim();

                var startMatch = Regex.Match(block, @"DTSTART[^:]*:(\d{8})");
                if (startMatch.Success && DateTime.TryParseExact(startMatch.Groups[1].Value, "yyyyMMdd",
                    null, System.Globalization.DateTimeStyles.None, out var start))
                    evt.Start = start;

                var endMatch = Regex.Match(block, @"DTEND[^:]*:(\d{8})");
                if (endMatch.Success && DateTime.TryParseExact(endMatch.Groups[1].Value, "yyyyMMdd",
                    null, System.Globalization.DateTimeStyles.None, out var end))
                    evt.End = end;

                if (!string.IsNullOrEmpty(evt.Uid))
                    events.Add(evt);
            }

            return events;
        }

        private class IcalEvent
        {
            public string Uid { get; set; } = "";
            public string? Summary { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
        }
    }

    public class JsonBookingImport
    {
        public string? ReservationId { get; set; }
        public string Platform { get; set; } = "Direct";
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string? GuestFirstName { get; set; }
        public string? GuestLastName { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestPhone { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
