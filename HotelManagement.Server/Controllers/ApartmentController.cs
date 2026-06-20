using AutoMapper;
using HotelManagement.DataAccess;
using HotelManagement.Models.Models;
using HotelManagement.Models;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Server.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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

        // ── Photo endpoints ──

        [HttpPost("{id}/photos")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadPhotos(Guid id, [FromForm] List<IFormFile> files)
        {
            var apartment = await _context.Apartments.FindAsync(id);
            if (apartment == null) return NotFound();

            if (files == null || files.Count == 0)
                return BadRequest("No files provided.");

            var maxSort = await _context.ApartmentPhotos
                .Where(p => p.ApartmentId == id)
                .MaxAsync(p => (int?)p.SortOrder) ?? 0;

            var results = new List<ApartmentPhotoDto>();
            foreach (var file in files)
            {
                if (!FileValidation.IsValidImage(file))
                    return BadRequest($"Invalid file: {file.FileName}. Only JPEG, PNG, WebP up to 5MB.");

                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                var photo = new ApartmentPhoto
                {
                    ApartmentId = id,
                    Data = ms.ToArray(),
                    ContentType = file.ContentType,
                    FileName = file.FileName,
                    SortOrder = ++maxSort,
                };
                _context.ApartmentPhotos.Add(photo);
                results.Add(_mapper.Map<ApartmentPhotoDto>(photo));
            }

            await _context.SaveChangesAsync();
            return Ok(results);
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<List<ApartmentPhotoDto>>> GetPhotos(Guid id)
        {
            var photos = await _context.ApartmentPhotos
                .Where(p => p.ApartmentId == id)
                .OrderBy(p => p.SortOrder)
                .ToListAsync();

            return Ok(_mapper.Map<List<ApartmentPhotoDto>>(photos));
        }

        [HttpGet("{id}/photos/{photoId}")]
        public async Task<IActionResult> GetPhoto(Guid id, Guid photoId)
        {
            var photo = await _context.ApartmentPhotos
                .FirstOrDefaultAsync(p => p.Id == photoId && p.ApartmentId == id);

            if (photo == null) return NotFound();
            return File(photo.Data, photo.ContentType, photo.FileName);
        }

        [HttpDelete("{id}/photos/{photoId}")]
        public async Task<IActionResult> DeletePhoto(Guid id, Guid photoId)
        {
            var photo = await _context.ApartmentPhotos
                .FirstOrDefaultAsync(p => p.Id == photoId && p.ApartmentId == id);

            if (photo == null) return NotFound();
            _context.ApartmentPhotos.Remove(photo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
