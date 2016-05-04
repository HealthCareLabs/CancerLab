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
        public ActionResult Manage()
        {
            using (var context = new BaseContext())
            {
                ViewBag.PageName = "Профиль";
                return View(context.DoctorProfiles.First(x => x.Email == User.Identity.Name));
            }
        }
        [ChildActionOnly]
        public ActionResult DoctorInfo()
        {
            BaseContext context = new BaseContext();
            var doctor = context.DoctorProfiles.First(x => x.Email == User.Identity.Name);
            return PartialView(doctor);
        }
    }
}
