using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    public class Apartment
    {
        [Key]
        public Guid Id { get; set; }
        public string ApartmentName { get; set; }

        public int ApartmentNumber { get; set; }
        public AppartmentStatus Status { get; set; }
    }
}
