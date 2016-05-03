using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;
using CancerLabWeb.Models;
using PagedList;

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
            notification.Count = new BaseContext().Treatments.Count(x => !x.IsAnswered || !x.IsViewed);
            return PartialView(notification);
        }

        [ChildActionOnly]
        public ActionResult DoctorInfo()
        {
            BaseContext context = new BaseContext();
            var doctor = context.DoctorProfiles.First(x => x.Email == User.Identity.Name);
            return PartialView(doctor);
        }

        [ChildActionOnly]
        public ActionResult LatestNewTreatments(int count = 5)
        {
            using (var context = new BaseContext())
            {
                var temp = context.Treatments.Where(x => x.IsViewed == false).OrderByDescending(x => x.DateOfTreatment).ToList();
                if (temp.Count() > count)
                {
                    temp = temp.Take(count).ToList();
                }
                foreach (var treatmentModel in temp)
                {
                    context.Entry(treatmentModel).Reference(x => x.Patient).Load();
                }
                return PartialView(temp);
            }
        }
        [ChildActionOnly]
        public ActionResult LatestNonAnsweredTreatments(int count = 5)
        {
            using (var context = new BaseContext())
            {
                var temp = context.Treatments.Where(x => x.IsViewed && !x.IsAnswered).OrderByDescending(x => x.DateOfTreatment).ToList();
                if (temp.Count() > count)
                {
                    temp = temp.Take(count).ToList();
                }
                foreach (var treatmentModel in temp)
                {
                    context.Entry(treatmentModel).Reference(x => x.Patient).Load();
                }
                return PartialView(temp);
            }
        }

        //
        //GET: Dashboard/ManageProfile

        public ActionResult ManageProfile()
        {
            using (var context = new BaseContext())
            {
                ViewBag.PageName = "Профиль";
                return View(context.DoctorProfiles.First(x => x.Email == User.Identity.Name));
            }
        }

        public ActionResult PatientsList(int? page)
        {
            using (var context = new BaseContext())
            {
                ViewBag.PageName = "Пациенты";
                int pageSize = 3;
                int pageNumber = (page ?? 1);
                return View(context.PatientProfiles.OrderBy(x => x.LastName).ToPagedList(pageNumber, pageSize));
            }
        }

        public ActionResult ViewPatientProfile(int id)
        {
            using (var context = new BaseContext())
            {
                ViewBag.PageName = "Профиль пациента";
                return View(context.PatientProfiles.First(x=>x.PatientId == id));
            }
        }
    }
}
