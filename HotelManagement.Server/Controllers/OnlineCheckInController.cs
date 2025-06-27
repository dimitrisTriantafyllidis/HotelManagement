using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnlineCheckInController : Controller
    {
        private readonly BookingContext _context;
        private readonly IMapper _mapper;

        public OnlineCheckInController(BookingContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OnlineCheckInDto>> Get(Guid id)
        {
            var form = await _context.OnlineCheckInForms.FindAsync(id);
            if (form == null) return NotFound();
            return Ok(_mapper.Map<OnlineCheckInDto>(form));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOnlineCheckInDto dto)
        {
            var entity = _mapper.Map<OnlineCheckIn>(dto);
            entity.SubmittedAt = DateTime.UtcNow;

            _context.OnlineCheckInForms.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<OnlineCheckInDto>(entity));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, OnlineCheckInDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.OnlineCheckInForms.FindAsync(id);
            if (entity == null) return NotFound();

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.OnlineCheckInForms.FindAsync(id);
            if (entity == null) return NotFound();

            _context.OnlineCheckInForms.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
