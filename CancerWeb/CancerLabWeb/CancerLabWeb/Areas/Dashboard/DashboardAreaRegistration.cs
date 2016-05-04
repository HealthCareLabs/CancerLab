using System.Web.Mvc;

namespace CancerLabWeb.Areas.Dashboard
{
    public class DashboardAreaRegistration : AreaRegistration
    {
        public override string AreaName => "Dashboard";

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Dashboard_default",
                "Dashboard/{controller}/{action}/{id}",
                new {controller="Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] {"CancerLabWeb.Areas.Dashboard.Controllers"}
            );
        }
    }
}
