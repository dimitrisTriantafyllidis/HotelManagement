using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models;
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

        public BookingsController(BookingContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
        {
            var items = await _context.Bookings
                .Include(b => b.Guests)
                .Include(b => b.CheckIn)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<BookingDto>>(items));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> Get(Guid id)
        {
            var item = await _context.Bookings
                .Include(b => b.Guests)
                .Include(b => b.CheckIn)
                .FirstOrDefaultAsync(b => b.Id == id);

            return item == null ? NotFound() : Ok(_mapper.Map<BookingDto>(item));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBookingDto dto)
        {
            var entity = _mapper.Map<Booking>(dto);
            _context.Bookings.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<BookingDto>(entity));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateBookingDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.Bookings.FindAsync(id);
            if (entity == null) return NotFound();
            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.Bookings.FindAsync(id);
            if (entity == null) return NotFound();
            _context.Bookings.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
