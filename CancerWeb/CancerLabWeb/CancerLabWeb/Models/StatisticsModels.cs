using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace CancerLabWeb.Models
{
    [Table("SexStatistics")]
    public class SexStatisticsModel
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int SexType { get; set; }

        public int PatientsCount { get; set; }
        public DateTime LastUpdateTime { get; set; }
    }

    [Table("AgeStatistics")]
    public class AgeStatisticsModel
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Age { get; set; }

        public int PatientsCount { get; set; }
        public DateTime LastUpdateTime { get; set; }
    }

    [Table("TumorSizeStatistics")]
    public class TumorSizeStatisticsModel
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int TumorSize { get; set; }

        public int PatientsCount { get; set; }
        public DateTime LastUpdateTime { get; set; }
    }

    [Table("TreatmentsStatistics")]
    public class TreatmentsStatisticsModel
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int StatId { get; set; }

        public int TotalCount { get; set; }
        public int AnsweredCount { get; set; }
        public DateTime StatsDate { get; set; }
        public DateTime LastUpdateTime { get; set; }
    }

}