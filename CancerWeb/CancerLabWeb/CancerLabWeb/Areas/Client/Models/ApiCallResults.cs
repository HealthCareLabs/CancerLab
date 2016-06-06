using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CancerLabWeb.Areas.Dashboard.Models;

namespace CancerLabWeb.Areas.Client.Models
{
    public class ApiCallResult
    {
        /// <summary>
        /// Returns, whether the request was successfull
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// Message for bad requests. Null if success is true
        /// </summary>
        public string Message { get; set; }
    }

    public class GetProfileResult:ApiCallResult
    {
        /// <summary>
        /// General patient's profile info
        /// </summary>
        public PatientProfile PatientProfile { get; set; }
    }

    public class RegisterResult : ApiCallResult
    {
        /// <summary>
        /// Patient's API key for login
        /// </summary>
        public string ApiKey { get; set; }
    }

    public class CreateTreatmentResult : ApiCallResult
    {
        public int TreatmentId { get; set; }

    }

    public class IssueCreateApiCall : ApiCallResult
    {
        public int IssueId { get; set; }
    }
}