using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace CancerLabWeb.Models
{
    public class TreatmentModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TreatmentId { get; set; }
        public int ParentTreatmentId { get; set; }

        public PatientProfile Patient { get; set; }
        public DateTime DateOfTreatment { get; set; }
        public string Title { get; set; }
        public string BodyField { get; set; }

        public DateTime DateOfAppear { get; set; }
        public ColorModification ColorModification { get; set; }
        public SurfaceModification SurfaceModification { get; set; }
        public LymphNodeEnlarging LymphNodeEnlarging { get; set; }

        public string PatientComment { get; set; }
        public List<TreatmentComment> TreatmentComments { get; set; }

        public bool IsAnswered { get; set; }
        public bool IsViewed { get; set; }

    }

    public class TreatmentComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentId { get; set; }
        public int AuthorId { get; set; }
        public int OrderNum { get; set; }
        public DateTime CommenTime { get; set; }
        public bool IsDoctorComment { get; set; }
    }

    public enum ColorModification
    {
        Darker, Brighter, NoChanges
    }

    public enum SurfaceModification
    {
        Bleeding, NonBleeding, NoChanges
    }

    public enum LymphNodeEnlarging
    {
        Yes, No
    }

}