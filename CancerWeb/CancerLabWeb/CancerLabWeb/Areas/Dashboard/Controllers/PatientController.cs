using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;
using PagedList;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    [Authorize]
    public class PatientController : Controller
    {
        private readonly BaseContext _dbContext = new BaseContext();
        //
        // GET: /Dashboard/Patient/

        public ActionResult List(int? page)
        {
            using (var context = new BaseContext())
            {
                ViewBag.PageName = "Пациенты";
                int pageSize = 10;
                int pageNumber = (page ?? 1);
                return View(_dbContext.PatientProfiles.OrderBy(x => x.LastName).ToPagedList(pageNumber, pageSize));
            }
        }

        public ActionResult View(int id)
        {
                ViewBag.PageName = "Профиль пациента";
                return View(_dbContext.PatientProfiles.First(x => x.PatientId == id));
        }

    }
}
