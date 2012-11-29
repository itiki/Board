using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using Microsoft.Practices.Unity;
using Board.Web.ViewModels;
using Board.Service;
using Board.Web.Helper;
using zic_dotnet;

namespace Board.Web.Controllers {
    public class AccountController : Controller {

        [Dependency]
        public IUserGet user_get { get; set; }
        [Dependency]
        public IUserSub user_sub { get; set; }
        [Dependency]
        public IFormsAuthentication authentication { get; set; }

        public ActionResult LogOn() {
            string name = User.Identity.Name;
            if(!string.IsNullOrEmpty(name))
                return RedirectToAction("Use", "Seat");
            return View();
        }

        [HttpPost]
        public ActionResult LogOn(LogOnModel model, string returnUrl) {
            if (!ModelState.IsValid) return View(model);
            mUser user = user_get.Login(model.UserName, model.Password);
            if (user == null) {
                ModelState.AddModelError("", "提供的用户名或密码不正确。");
                return View(model);
            }
            var roles = user_get.RoleGetByuser(user.Id);
            var auths = user_get.AuthGetByuser(user.Id);
            authentication.SetAuthCookie(this.HttpContext, AuthenticationTicketBuilder.CreateTicket(user, roles, auths));
            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1)
                return Redirect(returnUrl);
            else
                return RedirectToAction("Use", "Seat");
        }

        public ActionResult LogOff() {
            Session.Abandon();
            authentication.Signout();
            return RedirectToAction("LogOn", "Account");
        }

        public ActionResult Register() {
            return View();
        }

        [HttpPost]
        public ActionResult Register(RegisterModel model) {
            if (!ModelState.IsValid) return View(model);
            if (user_get.UserCheckNameExist(model.UserName)) {
                ModelState.AddModelError("", "用户名已存在。");
                return View(model);
            }
            mUser user = new mUser {
                Name = model.UserName,
                Password = model.Password
            };
            user_sub.UserAdd(user);
            //user_sub.UserAddByrole(user, "Guest");
            var roles = user_get.RoleGetByuser(user.Id);
            var auths = user_get.AuthGetByuser(user.Id);
            authentication.SetAuthCookie(this.HttpContext, AuthenticationTicketBuilder.CreateTicket(user, roles, auths));
            return RedirectToAction("Use", "Seat");
        }

        public ActionResult ChangePassword() {
            return View();
        }

        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model) {
            if (!ModelState.IsValid) return View(model);
            UserIdentity user = (UserIdentity)ViewBag.UserModel;
            if (user_sub.ChangePassword(int.Parse(user.Id), model.OldPassword, model.NewPassword)) {
                return RedirectToAction("ChangePasswordSuccess");
            } else {
                ModelState.AddModelError("", "当前密码不正确或新密码无效。");
                return View(model);
            }
        }

        public ActionResult ChangePasswordSuccess() {
            return View();
        }

    }
}