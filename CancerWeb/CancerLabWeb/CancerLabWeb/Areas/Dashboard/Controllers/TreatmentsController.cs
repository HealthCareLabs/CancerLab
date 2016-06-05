using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;
using PagedList;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    public class TreatmentsController : Controller
    {
        public int ResultsPerPage { get; } = 20;
        private readonly BaseContext _dbContext = new BaseContext();
        //
        // GET: /Dashboard/Treatments/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewTreatments(int? page)
        {
                int pageNumber = (page ?? 1);
                return
                    View(
                        _dbContext.Treatments.Where(x => !x.IsAnswered && !x.IsViewed)
                            .OrderByDescending(x => x.DateOfTreatment)
                            .ToList()
                            .ToPagedList(pageNumber,ResultsPerPage));
           
        }

        [ChildActionOnly]
        public ActionResult LatestNewTreatments(int count = 5)
        {
                var temp = _dbContext.Treatments.Where(x => x.IsViewed == false).OrderByDescending(x => x.DateOfTreatment).ToList();
                if (temp.Count() > count)
                {
                    temp = temp.Take(count).ToList();
                }
                foreach (var treatmentModel in temp)
                {
                    _dbContext.Entry(treatmentModel).Reference(x => x.Patient).Load();
                }
                return PartialView(temp);
            
        }
        [ChildActionOnly]
        public ActionResult LatestNonAnsweredTreatments(int count = 5)
        {
                var temp = _dbContext.Treatments.Where(x => x.IsViewed && !x.IsAnswered).OrderByDescending(x => x.DateOfTreatment).ToList();
                if (temp.Count() > count)
                {
                    temp = temp.Take(count).ToList();
                }
                foreach (var treatmentModel in temp)
                {
                    _dbContext.Entry(treatmentModel).Reference(x => x.Patient).Load();
                }
                return PartialView(temp);
        }
        [ChildActionOnly]
        public ActionResult TreatmentList(int id)
        {
                return PartialView(_dbContext.Treatments.Where(x => x.Patient.PatientId == id).ToList());
        }

    }
}
