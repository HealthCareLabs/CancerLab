using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;

namespace CancerLabWeb.Controllers
{
    public class PatientController : Controller
    {
        [ChildActionOnly]
        public ActionResult GetTreatmentList(int id)
        {
            using (var context = new BaseContext())
            {
                return PartialView(context.Treatments.Where(x => x.Patient.PatientId == id).ToList());
            }
        }
    }
}
