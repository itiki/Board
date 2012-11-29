using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;
using Board.Web.ViewModels.Validation;
using Board.Service;
using zic_dotnet;

namespace Board.Web.ViewModels {

    public class PropModel {
        [Required]
        [Display(Name = "显示名称")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "约定Key")]
        public string ClassName { get; set; }

        [Display(Name = "类型")]
        public string Type { get; set; }
    }

}
