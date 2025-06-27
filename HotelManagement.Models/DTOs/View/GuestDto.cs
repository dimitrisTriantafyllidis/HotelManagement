using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    public class GuestDto
    {
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public string? PassportNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public byte[]? FileBlob { get; set; }
        public Guid BookingId { get; set; }
        public BookingDto? Booking { get; set; }
    }
}
