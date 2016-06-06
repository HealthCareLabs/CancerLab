using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using CancerLabWeb.Areas.Dashboard.Models;

namespace CancerLabWeb.Areas.Client.Models
{
    public class ApiLoginModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ApiLoginId { get; set; }
        [Column(TypeName = "VARCHAR")]
        [StringLength(36)]
        [Index]
        public string ApiKey { get; set; }

        public PatientProfile PatientProfile { get; set; }

    }
}