using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace CancerLabWeb.Models
{
    public class DoctorsContext : DbContext
    {
        public DoctorsContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<DoctorProfile> DoctorProfiles { get; set; }
    }

    [Table("DoctorProfile")]
    public class DoctorProfile
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int DoctorId { get; set; }
        public string Email { get; set; }
        
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondName { get; set; }

        public string Organisation { get; set; }
        public string Position { get; set; }
        public string PhoneNumber { get; set; }

    }

    public class ResetPasswordModel
    {
        [Required]
        public string Email { get; set; }
    }

    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Текущий пароль")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Значение \"{0}\" должно содержать не менее {2} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Новый пароль")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("NewPassword", ErrorMessage = "Новый пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Имя пользователя")]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Display(Name = "Запомнить меня")]
        public bool RememberMe { get; set; }
    }

    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Имя пользователя")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Значение \"{0}\" должно содержать не менее {2} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }


        [Required] [Display(Name = "Имя")] public string Name { get; set; }
        [Required] [Display(Name = "Отчество")] public string SecondName { get; set; }
        [Required] [Display(Name = "Фамилия")] public string LastName { get; set; }

        [Phone]
        [DataType(DataType.PhoneNumber)] public string PhoneNumber { get; set; }

        [Required]
        [Display(Name = "Организация")]
        public string Organisation { get; set; }
        [Required]
        [Display(Name = "Должность")]
        public string Position { get; set; }

    }
}
