using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using CancerLabWeb.Areas.Client.Filters;
using CancerLabWeb.Areas.Client.Models;
using CancerLabWeb.Areas.Dashboard.Filters;
using CancerLabWeb.Areas.Dashboard.Models;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Controllers
{
    public class AccountController : ApiController
    {
        private readonly BaseContext _dbContext = new BaseContext();

        /// <summary>
        /// Checks user credentials
        /// </summary>
        /// <param name="loginModel">Login model, which provides user ID and API Key</param>
        /// <returns></returns>
        [ApiAuthorize, System.Web.Http.Route("api/account/login")]
        public ApiCallResult Login([FromUri]PatientLoginModel loginModel)
        {
            return new ApiCallResult { Success = true };
        }

        /// <summary>
        /// Get your profile info
        /// </summary>
        /// <param name="loginModel">Login model, which requires your ID and API key</param>
        /// <returns>returns </returns>
        /// <remarks>Requires authentication</remarks>
        [ApiAuthorize]
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/account/getProfile")]
        public GetProfileResult GetProfile([FromUri]PatientLoginModel loginModel)
        {
            var profile = _dbContext.PatientProfiles.FirstOrDefault(
                x => x.SessionId == loginModel.SessionId && x.PatientId == loginModel.PatientId);
            if (profile == null)
                return new GetProfileResult { Success = false, Message = "User not found" };
            return new GetProfileResult(){ Success = true, PatientProfile = profile };
        }

        /// <summary>
        /// Register user account
        /// </summary>
        /// <param name="registerModel">Register model from request</param>
        /// <returns></returns>
        [System.Web.Http.Route("api/account/register")]
        [System.Web.Http.HttpPost]
        public RegisterResult Register([FromBody]PatientRegistrationModel registerModel)
        {
            if (!ModelState.IsValid)
            {
                return new RegisterResult() { Success = false, Message = "Заполните все необходимые поля" };
            }

            if (_dbContext.PatientProfiles.FirstOrDefault(x => x.PhoneNumber == registerModel.PhoneNumber) == null)
            {
                string apiKey = GenerateApiKey();
                PatientProfile patient = new PatientProfile()
                {
                    Email = registerModel.Email,
                    Gender = registerModel.Gender,
                    RegisterDate = DateTime.Now,
                    BirthdayDate = registerModel.BirthdayDate,
                    Name = registerModel.Name,
                    LastName = registerModel.LastName,
                    SecondName = registerModel.SecondName,
                    PhoneNumber = registerModel.PhoneNumber,
                    PolicyNumber = registerModel.PolicyNumber,
                    SessionId = apiKey

                };
                _dbContext.PatientProfiles.Add(patient);
                _dbContext.SaveChanges();
                return new RegisterResult() { Success = true, SessionId = apiKey, PatientId = patient.PatientId };

            }
            return new RegisterResult() { Success = false, Message = "Пользователь с таким номером уже зарегистрирован" };

        }

        private static string GenerateApiKey()
        {
            return new Guid().ToString();
        }
    }
}