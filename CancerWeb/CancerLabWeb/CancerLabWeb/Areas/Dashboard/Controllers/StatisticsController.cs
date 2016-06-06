using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CancerLabWeb.Context;
using CancerLabWeb.Controllers;

namespace CancerLabWeb.Areas.Dashboard.Controllers
{
    [Authorize]
    public class StatisticsController : Controller
    {
        private readonly BaseContext _dbContext = new BaseContext();

        public JsonResult TreatmentsCount()
        {
            Dictionary<int, int> values = new Dictionary<int, int>();

            foreach (var stats in _dbContext.TreatmentsStatistics)
            {
                if (!values.ContainsKey(stats.Month))
                    values.Add(stats.Month, stats.TotalCount);
            }

            JsonObjects.ChartInfo chart = new JsonObjects.ChartInfo();
            chart.data = new List<JsonObjects.JsonChartData>();
            foreach (var value in values)
            {
                string month = Helper.GetMonthName(value.Key);
                chart.data.Add(new JsonObjects.JsonChartData()
                {
                    label = month,
                    y = value.Value

                });
            }
            return Json(chart, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SexStatistics()
        {
            JsonObjects.ChartInfo chart = new JsonObjects.ChartInfo();
            chart.data = new List<JsonObjects.JsonChartData>();
            foreach (var sexStatisticsModel in _dbContext.SexStatistics)
            {
                chart.data.Add(new JsonObjects.JsonChartData()
                {
                    label = sexStatisticsModel.SexType,
                    y = sexStatisticsModel.PatientsCount
                });
            }
            return Json(chart, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult AgeStatistics()
        {
            var ageStats = _dbContext.AgeStatistics.ToList();
            int currentAge = 10;
            Dictionary<int, int> values = new Dictionary<int, int>();
            while (currentAge < 100)
            {
                foreach (var ageStat in ageStats.Where(x => x.Age >= currentAge && x.Age < (currentAge + 10)))
                {
                    if (!values.ContainsKey(currentAge))
                    {
                        values.Add(currentAge, ageStat.PatientsCount);
                    }
                    else
                    {
                        values[currentAge] += ageStat.PatientsCount;
                    }
                }
                currentAge += 10;

            }
            JsonObjects.ChartInfo chart = new JsonObjects.ChartInfo();
            chart.data = new List<JsonObjects.JsonChartData>();
            foreach (var value in values)
            {
                chart.data.Add(new JsonObjects.JsonChartData()
                {
                    label = Helper.GetAgeRange(value.Key),
                    y = value.Value

                });
            }
            return Json(chart, JsonRequestBehavior.AllowGet);
    }

    public JsonResult SizeStatistics()
    {
            JsonObjects.ChartInfo chart = new JsonObjects.ChartInfo();
            chart.data = new List<JsonObjects.JsonChartData>();
            foreach (var tumorSizeStats in _dbContext.TumorSizeStatistics)
            {
                chart.data.Add(new JsonObjects.JsonChartData()
                {
                    label = tumorSizeStats.TumorSize.ToString() + " мм",
                    y = tumorSizeStats.PatientsCount
                });
            }
            return Json(chart, JsonRequestBehavior.AllowGet);
    }

}

public class JsonObjects
{
    public class JsonChartData
    {
        public string label { get; set; }
        public int y { get; set; }
    }

    public class ChartInfo
    {
        public List<JsonChartData> data { get; set; }
    }
}

public class Helper
{
    public static string GetMonthName(int num)
    {
        string month = "";
        switch (num)
        {
            case 1:
                month = "янв";
                break;
            case 2:
                month = "фев";
                break;
            case 3:
                month = "мар";
                break;
            case 4:
                month = "апр";
                break;
            case 5:
                month = "май";
                break;
            case 6:
                month = "июн";
                break;
            case 7:
                month = "июл";
                break;
            case 8:
                month = "авг";
                break;
            case 9:
                month = "сен";
                break;
            case 10:
                month = "окт";
                break;
            case 11:
                month = "ноя";
                break;
            case 12:
                month = "дек";
                break;

        }
        return month;

    }

    public static string GetGenderName(char gender)
    {
        switch (gender)
        {
            case 'м':
            case 'М':
                return "Мужской";
            case 'ж':
            case 'Ж':
                return "Женский";
            default:
                return "Не указан";
        }
    }

    public static string GetAgeRange(int startAge, int step = 10)
    {
        return startAge + "-" + (startAge + step);
    }
}
}
