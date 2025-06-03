using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace HotelManagement.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [DisplayName("Ονομα")]
        public string FirstName { get; set; }
        [Required]
        [DisplayName("Επωνυμο")]
        public string LastName { get; set; }
        [DisplayName("Email")]
        public string Email { get; set; }
        [Required]
        [DisplayName("Τηλέφωνο")]
        public string PhoneNumber { get; set; }
        [Required]
        [DisplayName("Date of arrival/Ημ.Αφιξης")]
        public DateOnly DateOfArrival { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        [Required]
        [DisplayName("Date of departure/Ημ.Αναχώρησης")]
        public DateOnly DateOfDeparture { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        [ValidateNever]
        public Guid AppartmentId { get; set; }

        public int OtpCode { get; set; }

        [ForeignKey("ApartmentId")]
        [ValidateNever]
        public Apartment Apartment { get; set; }
    }
}
