using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;
using Board.Web.ViewModels.Validation;

namespace Board.Web.ViewModels {

    public class UserModel {
        [Required]
        [Display(Name = "名称")]
        public string Name { get; set; }
    }

}
