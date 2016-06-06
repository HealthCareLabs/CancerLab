using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace CancerLabWeb.Areas.Client.Filters
{
    public class ApiAllowAnonymous : ActionFilterAttribute
    {
    }
}