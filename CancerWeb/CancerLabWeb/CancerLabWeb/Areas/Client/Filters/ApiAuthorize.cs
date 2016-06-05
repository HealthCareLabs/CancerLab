using System;
using System.Linq;
using System.Web.Mvc;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ApiAuthorize : FilterAttribute, IAuthorizationFilter
    {
        private readonly BaseContext _dbContext = new BaseContext();

        public bool IsValid(string key)
        {
            return _dbContext.PatientProfiles.FirstOrDefault(x => x.SessionId == key) != null;

        }

        public void OnAuthorization(AuthorizationContext filterContext)
        {
            var key = filterContext.HttpContext.Request.QueryString["apikey"];
            if (!IsValid(key))
            {
                filterContext.Result = new HttpUnauthorizedResult();
            }
        }
    }
}