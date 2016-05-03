using System.Web;
using System.Web.Optimization;

namespace CancerLabWeb
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Content/js/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Content/js/jquery-ui.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryvalidate").Include(
                        "~/Content/js/jquery.validate.js"));

            bundles.Add(new ScriptBundle("~/bundles/project").Include(
                        "~/Content/js/project.js")
                        .Include("~/Content/js/canvasjs.js"));


            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/css/project.css"));

            bundles.Add(new StyleBundle("~/Content/cssfont").Include("~/Content/css/font-awesome.min.css"));
        }
    }
}