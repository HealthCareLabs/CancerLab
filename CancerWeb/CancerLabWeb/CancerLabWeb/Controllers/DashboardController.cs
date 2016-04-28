using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;
using CancerLabWeb.Models;

namespace CancerLabWeb.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        //
        // GET: /Dashboard/

        public ActionResult Index()
        {
            ViewBag.PageName = "Главная";
            return View();
        }

        [ChildActionOnly]
        public ActionResult Notifications()
        {
            Notification notification = new Notification();
            notification.Count = 0;
            return PartialView(notification);
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
