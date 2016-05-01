using System.Web.Mvc;

namespace CancerLabWeb.Areas.Api
{
    public class ApiAreaRegistration : AreaRegistration
    {
        public override string AreaName => "Api";

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Api_default",
                "Api/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
