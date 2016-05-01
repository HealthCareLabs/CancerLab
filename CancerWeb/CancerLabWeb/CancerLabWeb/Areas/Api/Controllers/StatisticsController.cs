using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Api.Controllers
{
    public class StatisticsController : Controller
    {
        //
        // GET: /Api/Statistics/
        [HttpGet]
        public JsonResult MonthlyStatistics()
        {
            using (BaseContext context = new BaseContext())
            {
                int total = context.Treatments.Count();
                return View();
            }
        }

    }
}
