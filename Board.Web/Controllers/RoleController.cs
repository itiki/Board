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
    public class RoleController : Controller {

        [Dependency]
        public IUserGet user_get { get; set; }
        [Dependency]
        public IUserSub user_sub { get; set; }

        public ActionResult List() {
            IList<mRole> roles = user_get.RoleGetAll();
            return View(roles);
        }

        public ActionResult Creat() {
            return View();
        }
        [HttpPost]
        public ActionResult Creat(RoleModel role_mod) {
            if (!ModelState.IsValid) return View(role_mod);
            if (user_get.UserCheckNameExist(role_mod.Name)) {
                ModelState.AddModelError("", "角色名已存在。");
                return View(role_mod);
            }
            user_sub.RoleAdd(new mRole {
                Name = role_mod.Name
            });
            return RedirectToAction("List", "Role");
        }

        public ActionResult Index(int id) {
            mRole role = user_get.RoleGet(id);
            RoleModel rolemod = new RoleModel {
                Name = role.Name
            };
            ViewBag.Role = role;
            return View(rolemod);
        }
        [HttpPost]
        public ActionResult Index(int id, RoleModel role_mod) {
            if (!ModelState.IsValid) return View(role_mod);
            mRole role = user_get.RoleGet(id);
            role.Name = role_mod.Name;
            user_sub.RoleUpdate(role);
            return View(role_mod);
        }

        public ActionResult Delete(int id) {
            user_sub.RoleDelete(id);
            return RedirectToAction("List", "Role");
        }

        public ActionResult UserList(int id, int pageindex) {
            Pager<mUser> role_users = user_get.UserGetByrolePager(id, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(role_users);
        }
        public ActionResult UnUserList(int id, int pageindex) {
            Pager<mUser> role_users = user_get.UserGetByunrolePager(id, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(role_users);
        }
        public ActionResult UserRemove(int id, int pageindex, int itemid) {
            user_sub.RoleRemoveuser(itemid, id);
            return RedirectToAction("UserList", "Role", new { id = id, pageindex = pageindex });
        }
        public ActionResult UserAdd(int id, int pageindex, int itemid) {
            user_sub.RoleAdduser(itemid, id);
            return RedirectToAction("UnUserList", "Role", new { id = id, pageindex = pageindex });
        }

        public ActionResult AuthPropList(int id, int pageindex, string search) {
            ViewBag.SearchString = search;
            Pager<mAuth> auth_users = user_get.AuthPropGetByroleWithsearchPager(id, search, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(auth_users);
        }
        public ActionResult AuthPropRemove(int id, int pageindex, int itemid) {
            user_sub.RoleRemoveauth(itemid, id);
            return RedirectToAction("AuthPropList", "Role", new { id = id, pageindex = pageindex });
        }
        public ActionResult UnAuthPropList(int id, int pageindex, string search) {
            ViewBag.SearchString = search;
            Pager<mAuth> auth_users = user_get.AuthPropGetByunroleWithsearchPager(id, search, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(auth_users);
        }
        public ActionResult AuthPropAdd(int id, int pageindex, int itemid) {
            user_sub.RoleAddauth(itemid, id);
            return RedirectToAction("UnAuthPropList", "Role", new { id = id, pageindex = pageindex });
        }
        public ActionResult AuthUseList(int id, int pageindex, string search) {
            ViewBag.SearchString = search;
            Pager<mAuth> auth_users = user_get.AuthUseGetByroleWithsearchPager(id, search, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(auth_users);
        }
        public ActionResult AuthUseRemove(int id, int pageindex, int itemid) {
            user_sub.RoleRemoveauth(itemid, id);
            return RedirectToAction("AuthUseList", "Role", new { id = id, pageindex = pageindex });
        }
        public ActionResult UnAuthUseList(int id, int pageindex, string search) {
            ViewBag.SearchString = search;
            Pager<mAuth> auth_users = user_get.AuthUseGetByunroleWithsearchPager(id, search, 10, pageindex);
            ViewBag.Role = user_get.RoleGet(id);
            return View(auth_users);
        }
        public ActionResult AuthUseAdd(int id, int pageindex, int itemid) {
            user_sub.RoleAddauth(itemid, id);
            return RedirectToAction("UnAuthUseList", "Role", new { id = id, pageindex = pageindex });
        }

    }
}
