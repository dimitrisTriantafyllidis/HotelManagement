using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models.DTOs.View
{
    public class ApplicationUserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string? OrganizationName { get; set; }
        public DateTime RegisteredAt { get; set; }
    }
}
