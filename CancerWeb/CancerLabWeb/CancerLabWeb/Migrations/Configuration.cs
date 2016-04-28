using CancerLabWeb.Context;
using CancerLabWeb.Models;

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
            context.PatientProfiles.AddOrUpdate(
                new PatientProfile()
                {
                    BirthdayDate = DateTime.Now,
                    Email = "net.reversing@gmail.com",
                    Gender = "Мужской",
                    LastMessageTime = DateTime.Now,
                    LastName = "Миленко",
                    Name = "Владимир",
                    SecondName = "Романович",
                    PhoneNumber = "89996024873",
                    PolicyNumber = "555-5122-3111",
                    RegisterDate = DateTime.Today
                }
            );
            context.SaveChanges();
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
