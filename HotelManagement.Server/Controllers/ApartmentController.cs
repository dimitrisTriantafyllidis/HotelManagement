using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.Server.Controllers
{
    public class ApartmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
