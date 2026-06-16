using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models.DTOs.Create;
using HotelManagement.Models.DTOs.Update;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceTasksController : ControllerBase
    {
        private readonly BookingContext _context;
        private readonly IMapper _mapper;

        public MaintenanceTasksController(BookingContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceTaskDto>>> GetAll(
            [FromQuery] string? status,
            [FromQuery] Guid? apartmentId,
            [FromQuery] string? assignedTo)
        {
            var query = _context.MaintenanceTasks
                .Include(m => m.Apartment)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(m => m.Status == status);

            if (apartmentId.HasValue)
                query = query.Where(m => m.ApartmentId == apartmentId.Value);

            if (!string.IsNullOrEmpty(assignedTo))
                query = query.Where(m => m.AssignedTo == assignedTo);

            var items = await query.OrderBy(m => m.DueDate).ToListAsync();
            return Ok(_mapper.Map<IEnumerable<MaintenanceTaskDto>>(items));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceTaskDto>> Get(Guid id)
        {
            var item = await _context.MaintenanceTasks
                .Include(m => m.Apartment)
                .FirstOrDefaultAsync(m => m.Id == id);

            return item == null ? NotFound() : Ok(_mapper.Map<MaintenanceTaskDto>(item));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMaintenanceTaskDto dto)
        {
            var entity = _mapper.Map<MaintenanceTask>(dto);
            _context.MaintenanceTasks.Add(entity);
            await _context.SaveChangesAsync();

            await _context.Entry(entity).Reference(m => m.Apartment).LoadAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, _mapper.Map<MaintenanceTaskDto>(entity));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateMaintenanceTaskDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.MaintenanceTasks.FindAsync(id);
            if (entity == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Status)) entity.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.AssignedTo)) entity.AssignedTo = dto.AssignedTo;
            if (!string.IsNullOrEmpty(dto.PhotoProofUrl)) entity.PhotoProofUrl = dto.PhotoProofUrl;
            if (!string.IsNullOrEmpty(dto.CompletionNotes)) entity.CompletionNotes = dto.CompletionNotes;

            if (dto.Status == "Done")
                entity.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.MaintenanceTasks.FindAsync(id);
            if (entity == null) return NotFound();
            _context.MaintenanceTasks.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Trigger: Auto-create cleaning tasks for all bookings checking out today.
        /// Call this from a scheduled job or manually.
        /// </summary>
        [HttpPost("generate-checkout-tasks")]
        public async Task<ActionResult<IEnumerable<MaintenanceTaskDto>>> GenerateCheckoutTasks()
        {
            var today = DateTime.UtcNow.Date;

            var checkingOut = await _context.Bookings
                .Include(b => b.Apartment)
                .Where(b => b.CheckOutDate.Date == today && b.Status != "Cancelled")
                .ToListAsync();

            var created = new List<MaintenanceTask>();

            foreach (var booking in checkingOut)
            {
                var exists = await _context.MaintenanceTasks.AnyAsync(m =>
                    m.BookingId == booking.Id && m.TaskType == "Cleaning");

                if (exists) continue;

                var task = new MaintenanceTask
                {
                    ApartmentId = booking.ApartmentId,
                    BookingId = booking.Id,
                    Title = $"Checkout Cleaning - {booking.Apartment?.Name}",
                    Description = $"Turnover cleaning for checkout of {booking.GuestLastName ?? "Guest"}",
                    TaskType = "Cleaning",
                    Status = "Todo",
                    DueDate = today
                };

                _context.MaintenanceTasks.Add(task);
                created.Add(task);
            }

            await _context.SaveChangesAsync();

            foreach (var task in created)
                await _context.Entry(task).Reference(m => m.Apartment).LoadAsync();

            return Ok(_mapper.Map<IEnumerable<MaintenanceTaskDto>>(created));
        }
    }
}
