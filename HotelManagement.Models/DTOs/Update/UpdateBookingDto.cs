using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{ 
    public class UpdateBookingDto
    {
        public Guid Id { get; set; }
        public Guid ApartmentId { get; set; }
        public ApartmentDto? Apartment { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public List<GuestDto>? Guests { get; set; }
        public OnlineCheckInDto? CheckIn { get; set; }
    }
}
