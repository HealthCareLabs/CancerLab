using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Handlers
{
    public class AuthorizationHeaderHandler : DelegatingHandler
    {
        private BaseContext _dbContext = new BaseContext();

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            IEnumerable<string> apiKeyHeaderValues = null;
            if (request.Headers.TryGetValues("X-ApiKey", out apiKeyHeaderValues))
            {
                var apiKeyHeaderValue = apiKeyHeaderValues.First();
                var user =
                    _dbContext.ApiAuthentication.Include("PatientProfiles")
                        .FirstOrDefault(x => x.ApiKey == apiKeyHeaderValue);
                if (user != null)
                {
                    var usernameClaim = new Claim(ClaimTypes.Name, user.PatientProfile.PatientId.ToString());
                    var identity = new ClaimsIdentity(new[] {usernameClaim}, "ApiKey");
                    var principal = new ClaimsPrincipal(identity);

                    Thread.CurrentPrincipal = principal;
                }
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}