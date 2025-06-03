using Microsoft.AspNetCore.Mvc;

namespace HotemManagement.Server.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
