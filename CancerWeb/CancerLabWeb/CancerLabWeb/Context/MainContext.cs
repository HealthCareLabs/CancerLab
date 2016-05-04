using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using CancerLabWeb.Areas.Dashboard.Models;

namespace CancerLabWeb.Context
{
    public class BaseContext : DbContext
    {
        public BaseContext()
            : base("DefaultConnection")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }


        public DbSet<DoctorProfile> DoctorProfiles { get; set; }
        public DbSet<PatientProfile> PatientProfiles { get; set; }
        public DbSet<TreatmentModel> Treatments { get; set; }

        public DbSet<SexStatisticsModel> SexStatistics { get; set; }
        public DbSet<AgeStatisticsModel> AgeStatistics { get; set; }
        public DbSet<TumorSizeStatisticsModel> TumorSizeStatistics { get; set; }
        public DbSet<TreatmentsStatisticsModel> TreatmentsStatistics { get; set; }
    }

}