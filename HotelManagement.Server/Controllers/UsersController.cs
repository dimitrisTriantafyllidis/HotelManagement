using AutoMapper;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using HotelManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using HotelManagement.Models.DTOs.Create;

namespace HotemManagement.Server.Controllers
{
    public class UsersController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UsersController(UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ApplicationUserDto>> GetAll()
        {
            var users = _userManager.Users.ToList();
            return Ok(_mapper.Map<IEnumerable<ApplicationUserDto>>(users));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUserDto>> Get(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound();
            return Ok(_mapper.Map<ApplicationUserDto>(user));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserDto dto)
        {
            var user = _mapper.Map<ApplicationUser>(dto);
            user.UserName = dto.Email;
            user.RegisteredAt = DateTime.UtcNow;

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(_mapper.Map<ApplicationUserDto>(user));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
        {
            if (id != dto.Id) return BadRequest();

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound();

            _mapper.Map(dto, user);
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }
    }
}
