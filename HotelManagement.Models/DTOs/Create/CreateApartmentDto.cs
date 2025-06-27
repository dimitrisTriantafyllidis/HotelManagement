
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    public class CreateApartmentDto
    {
        public string? Name { get; set; }
        public string? Location { get; set; }

        public List<BookingDto>? Bookings { get; set; }
    }
}
