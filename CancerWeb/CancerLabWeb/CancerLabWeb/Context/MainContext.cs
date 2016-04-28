using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using CancerLabWeb.Models;

namespace CancerLabWeb.Context
{
    public class BaseContext : DbContext
    {
        public BaseContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<DoctorProfile> DoctorProfiles { get; set; }
        public DbSet<PatientProfile> PatientProfiles { get; set; }
        public DbSet<TreatmentModel> Treatments { get; set; }
    }

}