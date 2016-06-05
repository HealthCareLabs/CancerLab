using CancerLabWeb.Areas.Dashboard.Models;
using CancerLabWeb.Context;

namespace CancerLabWeb.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<BaseContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(BaseContext context)
        {
          /*  context.PatientProfiles.AddOrUpdate(
      new PatientProfile()
      {
          BirthdayDate = DateTime.Parse("14.01.1997"),
          Email = "net.reversing@gmail.com",
          Gender = "Мужской",
          LastMessageTime = DateTime.Now,
          LastName = "Миленко",
          Name = "Владимир",
          SecondName = "Романович",
          PhoneNumber = "89996024873",
          PolicyNumber = "555-5122-3111-2020",
          RegisterDate = DateTime.Today
      }
  );
            context.SaveChanges();
            context.Treatments.AddOrUpdate(new TreatmentModel()
            {
                BodyField = "Рука",
                //ColorModification = ColorModification.Brighter,
                DateOfAppear = DateTime.Now.AddMonths(-6).Date,
                DateOfTreatment = DateTime.Now,
                IsAnswered = false,
                IsViewed = false,
                //LymphNodeEnlarging = LymphNodeEnlarging.No,
                Patient = context.PatientProfiles.First()
            });
            context.Treatments.AddOrUpdate(new TreatmentModel()
            {
                BodyField = "Рука",
                //ColorModification = ColorModification.Brighter,
                DateOfAppear = DateTime.Now.AddMonths(-6).Date,
                DateOfTreatment = DateTime.Now,
                IsAnswered = false,
                IsViewed = true,
                //LymphNodeEnlarging = LymphNodeEnlarging.No,
                Patient = context.PatientProfiles.First()
            });
            context.SaveChanges();

            foreach (var group in context.PatientProfiles.GroupBy(x => ((DateTime)x.BirthdayDate).Year).ToList())
            {
                context.AgeStatistics.AddOrUpdate(new AgeStatisticsModel()
                {
                    Age = DateTime.Now.Year - group.Key,
                    LastUpdateTime = DateTime.Now.AddMinutes(-4),
                    PatientsCount = group.Count()
                });
            }


            foreach (var group in context.Treatments.GroupBy(x => x.Size).ToList())
            {
                context.TumorSizeStatistics.AddOrUpdate(new TumorSizeStatisticsModel()
                {
                    LastUpdateTime = DateTime.Now.AddMinutes(-6),
                    PatientsCount = group.Count(),
                    TumorSize = group.Key
                });
            }
            foreach (var group in context.PatientProfiles.GroupBy(x => x.Gender).ToList())
            {
                context.SexStatistics.AddOrUpdate(new SexStatisticsModel()
                {
                    LastUpdateTime = DateTime.Now.AddMinutes(-8),
                    PatientsCount = group.Count(),
                    SexType = group.Key
                });
            }
            foreach (var group in context.Treatments.GroupBy(x => x.DateOfTreatment.Month).ToList())
            {
                context.TreatmentsStatistics.AddOrUpdate(new TreatmentsStatisticsModel()
                {
                    LastUpdateTime = DateTime.Now.AddMinutes(-4),
                    Month = group.Key,
                    Year = 2016,
                    TotalCount = group.Count(),
                });
            }

            context.SaveChanges();
            */
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
