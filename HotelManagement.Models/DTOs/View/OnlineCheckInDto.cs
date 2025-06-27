using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    public class OnlineCheckInDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? FatherName { get; set; }
        public string? MotherName { get; set; }

        public string IdentityNo { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; }
        public string? CountryOfOrigin { get; set; }

        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        public string? Appartment { get; set; }

        public DateTime? DateOfArrival { get; set; }
        public DateTime? DateOfDeparture { get; set; }

        public bool Agree { get; set; }

        public string? SignatureData { get; set; } // base64 PNG
        public string? PdfData { get; set; }       // base64 PDF

        public DateTime? SubmittedAt { get; set; }

        public Guid? BookingId { get; set; }
    }

}
