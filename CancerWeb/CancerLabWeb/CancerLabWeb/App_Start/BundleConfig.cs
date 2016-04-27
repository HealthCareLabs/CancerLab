using System.Web;
using System.Web.Optimization;

namespace CancerLabWeb
{
    public class BundleConfig
    {
        // Дополнительные сведения о Bundling см. по адресу http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Content/js/jquery-{version}.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Content/js/jquery-ui-{version}.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/project").Include(
                        "~/Content/js/jquery-ui-{version}.min.js"));
            // Используйте версию Modernizr для разработчиков, чтобы учиться работать. Когда вы будете готовы перейти к работе,
            // используйте средство построения на сайте http://modernizr.com, чтобы выбрать только нужные тесты.

            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/css/project.css"));

            bundles.Add(new StyleBundle("~/Content/cssfont").Include("~/Content/css/font-awesome.min.css"));
        }
    }
}