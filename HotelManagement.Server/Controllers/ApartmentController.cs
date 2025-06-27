using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models.Models;
using HotelManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApartmentsController : ControllerBase
    {
        private readonly BookingContext _context;
        private readonly IMapper _mapper;

        public ApartmentsController(BookingContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetAll()
        {
            var items = await _context.Apartments.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<ApartmentDto>>(items));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApartmentDto>> Get(Guid id)
        {
            var item = await _context.Apartments.FindAsync(id);
            return item == null ? NotFound() : Ok(_mapper.Map<ApartmentDto>(item));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateApartmentDto dto)
        {
            var entity = _mapper.Map<Apartment>(dto);
            _context.Apartments.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<ApartmentDto>(entity));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateApartmentDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.Apartments.FindAsync(id);
            if (entity == null) return NotFound();
            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.Apartments.FindAsync(id);
            if (entity == null) return NotFound();
            _context.Apartments.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
