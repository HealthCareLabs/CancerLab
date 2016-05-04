using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        //
        // GET: /Dashboard/Home/

        public ActionResult Index()
        {
            return View();
        }

    }
}
