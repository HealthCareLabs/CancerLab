using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Areas.Dashboard.Models;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    [Authorize]
    public class NotificationsController : Controller
    {
        [ChildActionOnly]
        public ActionResult Notifications()
        {
            Notification notification = new Notification();
            notification.Count = new BaseContext().Treatments.Count(x => !x.IsAnswered || !x.IsViewed);
            return PartialView(notification);
        }

    }
}
