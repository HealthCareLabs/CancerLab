using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CancerLabWeb.Models
{
    [Table("PatientProfiles")]
    public class PatientProfile
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int PatientId { get; set; }

        public string SessionId { get; set; }

        public string Name { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }

        public string Gender { get; set; }
        public DateTime BirthdayDate { get; set; }
        public string PolicyNumber { get; set; }

        public DateTime RegisterDate { get; set; }
        public DateTime LastMessageTime { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
    }

    public class PatientLoginModel
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        public string SessionId { get; set; }
    }
}