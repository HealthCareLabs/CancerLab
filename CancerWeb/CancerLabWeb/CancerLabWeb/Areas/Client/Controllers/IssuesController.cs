using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using CancerLabWeb.Areas.Client.Models;
using CancerLabWeb.Areas.Dashboard.Models;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Controllers
{
    public class IssuesController : ApiController
    {
        private BaseContext _dbContext = new BaseContext();
        /// <summary>
        /// Creates issue in selected treatment
        /// </summary>
        /// <param name="treatmentId">Parent treatment</param>
        /// <param name="treatmentIssue" type="TreatmentIssue">Issue itself</param>
        /// <returns>Returns id of created issue is success, message otherwise</returns>
        [HttpPost, Route("api/issues/create")]
        public IssueCreateApiCall Create(ApiTreatmentIssue treatmentIssue)
        {
            int userId = Int32.Parse(Thread.CurrentPrincipal.Identity.Name);
            var treatment =
                _dbContext.Treatments.Include(x=>x.Patient).FirstOrDefault(x => x.TreatmentId == treatmentIssue.ParentTreatmentId && x.Patient.PatientId == userId);
            if (treatment!=null)
            {
                List<ImageModel> images = new List<ImageModel>();
                foreach (var imageId in treatmentIssue.Images)
                {
                    var img =
                        _dbContext.Images.Include(x => x.Owner)
                            .FirstOrDefault(x => x.ImageId == imageId && x.Owner.PatientId == userId);

                    if(img!=null)
                        images.Add(_dbContext.Images.Include(x=>x.Owner).First(x=>x.ImageId == imageId && x.Owner.PatientId == userId));
                    else
                        return new IssueCreateApiCall() {Success = false, Message = "Invalid image ids"};
                }
                var dbIssue = new TreatmentIssue()
                {
                    ColorModification = treatmentIssue.ColorModification,
                    LymphNodeEnlarging = treatmentIssue.LymphNodeEnlarging,
                    SurfaceModification = treatmentIssue.SurfaceModification,
                    Images = images,
                    PatientComment = treatmentIssue.PatientComment,
                    Size = treatmentIssue.Size

                };
                treatment.Issues.Add(dbIssue);
                _dbContext.SaveChanges();
                return new IssueCreateApiCall() {IssueId = dbIssue.IssueId, Success = true};
            }
            return new IssueCreateApiCall() {Success = false, Message = "Parent treatment not found"};
        }
    }
}
