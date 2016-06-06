using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Mvc;
using CancerLabWeb.Context;
using ActionFilterAttribute = System.Web.Http.Filters.ActionFilterAttribute;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;
using FilterAttribute = System.Web.Mvc.FilterAttribute;
using IAuthorizationFilter = System.Web.Mvc.IAuthorizationFilter;

namespace CancerLabWeb.Areas.Client.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ApiAuthorize : AuthorizationFilterAttribute
    {
        private readonly BaseContext _dbContext = new BaseContext();

        private bool IsValid(HttpActionContext context)
        {
            var request = context.Request;
            IEnumerable<string> apiKeyValues;
            if (!request.Headers.TryGetValues("X-ApiKey", out apiKeyValues))
                return false;
            string apiKey = apiKeyValues.First();

            var user =
                _dbContext.ApiAuthentication.Include("PatientProfile")
                    .FirstOrDefault(x => x.ApiKey == apiKey);
            if (user != null)
            {
                var usernameClaim = new Claim(ClaimTypes.Name, user.PatientProfile.PatientId.ToString());
                var identity = new ClaimsIdentity(new[] { usernameClaim }, "ApiKey");
                var principal = new ClaimsPrincipal(identity);

                Thread.CurrentPrincipal = principal;
                return true;
            }
            return false;
        }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.ActionDescriptor.GetCustomAttributes<ApiAllowAnonymous>(false).Any())
            {
                return;
            }
            if (!IsValid(actionContext))
                actionContext.Response.StatusCode = HttpStatusCode.Unauthorized;
        }
    }
}