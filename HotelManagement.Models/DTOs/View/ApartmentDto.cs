using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    public class ApartmentDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }

        public List<BookingDto>? Bookings { get; set; }
    }
}
