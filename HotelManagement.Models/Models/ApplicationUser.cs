using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; }
        public string? OrganizationName { get; set; }

        // Optional: For multi-tenant or company-based segregation
        public Guid? TenantId { get; set; }

        // System metadata
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        // Navigation properties (optional)
        public ICollection<IdentityUserClaim<Guid>> Claims { get; set; }
        public ICollection<IdentityUserRole<Guid>> Roles { get; set; }

        public ICollection<Booking> Bookings { get; set; }
    }
}
