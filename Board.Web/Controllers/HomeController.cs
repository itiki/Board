using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.Mvc;

namespace Board.Web.Controllers {
    public class HomeController : Controller {

        [OutputCache(Duration = 10, Location = OutputCacheLocation.Server)]
        public ActionResult Index() {
            ViewBag.Message = "欢迎使用 布告栏!";
            return View();
        }

        public ActionResult About() {
            return View();
        }

        public ActionResult Error() {
            return View();
        }

        public ActionResult Error_notfound() {
            return View();
        }

        public ActionResult Nav() {
            return View();
        }

    }
}
