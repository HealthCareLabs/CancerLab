using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    public class TreatmentsController : Controller
    {
        //
        // GET: /Dashboard/Treatments/

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
        [ChildActionOnly]
        public ActionResult TreatmentList(int id)
        {
            using (var context = new BaseContext())
            {
                return PartialView(context.Treatments.Where(x => x.Patient.PatientId == id).ToList());
            }
        }

    }
}
