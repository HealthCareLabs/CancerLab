using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using CancerLabWeb.Areas.Dashboard.Models;

namespace CancerLabWeb.Areas.Client.Models
{
    public class ImageModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ImageId { get; set; }
        public PatientProfile Owner { get; set; }

        public string FullSizePath { get; set; }
        public string PreviewPath { get; set; }
        public string ThumbnailPath { get; set; }
        public byte[] SourceImage { get; set; }
    }
}