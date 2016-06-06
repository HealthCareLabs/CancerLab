using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    [Authorize]
    public class ProfileController : Controller
    {
        private readonly BaseContext _dbContext = new BaseContext();
        public ActionResult Manage()
        {
                ViewBag.PageName = "Профиль";
                return View(_dbContext.DoctorProfiles.First(x => x.Email == User.Identity.Name));
        }
        [ChildActionOnly]
        public ActionResult DoctorInfo()
        {
            var doctor = _dbContext.DoctorProfiles.First(x => x.Email == User.Identity.Name);
            return PartialView(doctor);
        }
    }
}
