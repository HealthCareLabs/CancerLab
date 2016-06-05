using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace CancerLabWeb.Areas.Dashboard.Models
{
    [Table("PatientProfiles")]
    public class PatientProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PatientId { get; set; }

        public string SessionId { get; set; }

        public string Name { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }

        public string Gender { get; set; }
        public DateTime? BirthdayDate { get; set; }
        public string PolicyNumber { get; set; }

        public DateTime? RegisterDate { get; set; }
        public DateTime? LastMessageTime { get; set; }
        public string PhoneNumber { get; set; }

        public string Email { get; set; }
    }
    [DataContract]
    public class PatientRegistrationModel
    {
        [DataMember(IsRequired = true)]
        [Required]
        public string Name { get; set; }

        public string SecondName { get; set; }
        [DataMember(IsRequired = true)]
        [Required]
        public string LastName { get; set; }

        [DataMember(IsRequired = true)]
        [Required]
        public DateTime? BirthdayDate { get; set; }

        [DataMember(IsRequired = true)]
        [Required]
        public string Gender { get; set; }

        [DataMember(IsRequired = true)]
        [Required]
        public string PolicyNumber { get; set; }

        [DataMember(IsRequired = true)]
        [Required]
        public string Location { get; set; }
        [DataMember(IsRequired = true)]
        [Required]
        public string PhoneNumber { get; set; }
        [DataMember(IsRequired = true)]
        [Required]
        public string Email { get; set; }
    }

    [DataContract]
    public class PatientLoginModel
    {
        [DataMember(IsRequired = true)]
        [Required]
        public int PatientId { get; set; }
        [DataMember(IsRequired = true)]
        [Required]
        public string SessionId { get; set; }
    }
}