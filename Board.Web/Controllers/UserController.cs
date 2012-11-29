using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Board.Web.ViewModels;
using Board.Service;
using Board.Web.Helper;
using zic_dotnet;

namespace Board.Web.Controllers {
    [Authorize]
    public class UserController : Controller {

        [Dependency]
        public IUserGet user_get { get; set; }
        [Dependency]
        public IUserSub user_sub { get; set; }

        public ActionResult Index(int id) {
            mUser user = user_get.UserGet(id);
            UserModel usermod = new UserModel {
                Name = user.Name
            };
            return View(usermod);
        }

        public ActionResult List(int pageindex) {
            Pager<mUser> roles = user_get.UserGetPager(10, pageindex);
            return View(roles);
        }

        public ActionResult Delete(int id) {
            user_sub.UserDelete(id);
            return RedirectToAction("List", "User");
        }
    }
}