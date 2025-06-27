using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.Server.Controllers
{
    public class RolesController : Controller
    {
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public RolesController(RoleManager<IdentityRole<Guid>> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult GetAllRoles()
        {
            var roles = _roleManager.Roles.Select(r => new RoleDto { Name = r.Name! }).ToList();
            return Ok(roles);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
        {
            if (await _roleManager.RoleExistsAsync(dto.Name))
                return BadRequest("Role already exists");

            var result = await _roleManager.CreateAsync(new IdentityRole<Guid>(dto.Name));
            return result.Succeeded ? Ok() : BadRequest(result.Errors);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
            if (user == null)
                return NotFound("User not found");

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return NotFound("Role not found");

            var result = await _userManager.AddToRoleAsync(user, dto.Role);
            return result.Succeeded ? Ok() : BadRequest(result.Errors);
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveRole([FromBody] AssignRoleDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.RemoveFromRoleAsync(user, dto.Role);
            return result.Succeeded ? Ok() : BadRequest(result.Errors);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRoles(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }
    }
}
