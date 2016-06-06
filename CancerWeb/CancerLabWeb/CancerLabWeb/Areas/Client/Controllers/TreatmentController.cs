using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using CancerLabWeb.Areas.Client.Filters;
using CancerLabWeb.Areas.Client.Models;
using CancerLabWeb.Areas.Dashboard.Models;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Controllers
{
    public class TreatmentController : ApiController
    {
        private readonly BaseContext _dbContext = new BaseContext();
        // GET api/<controller>
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [ApiAuthorize, Route("api/treatments/all"), HttpGet]
        public IQueryable<TreatmentModel> AllTreatments()
        {
            int userId = int.Parse(Thread.CurrentPrincipal.Identity.Name);
            return
                _dbContext.Treatments.Include(x=>x.Issues).Where(x => x.Patient.PatientId == userId);
        }


        // POST api/<controller>
        /// <summary>
        /// Creates treatment for future issues
        /// </summary>
        /// <param name="apiTreatment">API treatment model</param>
        /// <returns>Returns ID of created treatment</returns>
        [ApiAuthorize, Route("api/treatments/create"), HttpPost]
        public CreateTreatmentResult Create(ApiTreatmentModel apiTreatment)
        {
            int userId = int.Parse(Thread.CurrentPrincipal.Identity.Name);
            var patient = _dbContext.PatientProfiles.FirstOrDefault(x => x.PatientId == userId);
            if (patient != null)
            {
                var treatment = new TreatmentModel()
                {
                    Title = apiTreatment.Title,
                    BodyField = apiTreatment.BodyField,
                    CreationDate = DateTime.Now,
                    DateOfAppear = apiTreatment.DateOfAppear,
                    Patient = patient
                };
                _dbContext.Treatments.Add(treatment);
                _dbContext.SaveChanges();
                return new CreateTreatmentResult() {Success = true, TreatmentId = treatment.TreatmentId};
            }
            return new CreateTreatmentResult()
            {
                Success = true,
                Message = "Wrong parent treatment id"
            };
        }
    }
}