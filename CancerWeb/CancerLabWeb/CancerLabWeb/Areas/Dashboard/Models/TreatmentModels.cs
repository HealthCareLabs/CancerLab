using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CancerLabWeb.Areas.Client.Models;

namespace CancerLabWeb.Areas.Dashboard.Models
{
    public class TreatmentModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TreatmentId { get; set; }

        public PatientProfile Patient { get; set; }

        [Index]
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string BodyField { get; set; }

        public DateTime DateOfAppear { get; set; }

        public virtual List<TreatmentIssue> Issues { get; set; }

        public bool IsAnswered { get; set; }
        public bool IsViewed { get; set; }

    }

    public class ApiTreatmentModel
    {
        [Required]
        [Index]
        public string Title { get; set; }
        [Required]
        public string BodyField { get; set; }
        [Required]
        public DateTime DateOfAppear { get; set; }
    }

    public class TreatmentIssue
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IssueId { get; set; }

        [Index]
        public int Size { get; set; }

        public ColorModification ColorModification { get; set; }
        public SurfaceModification SurfaceModification { get; set; }
        public LymphNodeEnlarging LymphNodeEnlarging { get; set; }

        public string PatientComment { get; set; }

        public virtual IEnumerable<TreatmentComment> Comments { get; set; }
        public virtual IEnumerable<ImageModel> Images { get; set; }
    }

    public class ApiTreatmentIssue
    {
        [Required]
        public int ParentTreatmentId { get; set; }
        [Required]
        [Index]
        public int Size { get; set; }
        [Required]
        public ColorModification ColorModification { get; set; }
        [Required]
        public SurfaceModification SurfaceModification { get; set; }
        [Required]
        public LymphNodeEnlarging LymphNodeEnlarging { get; set; }
        [Required]
        public string PatientComment { get; set; }
        [Required]
        public List<int> Images { get; set; }
    }

    public class TreatmentComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentId { get; set; }
        public DoctorProfile Author { get; set; }
        public DateTime CommentDate { get; set; }
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