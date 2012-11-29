using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Text;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Microsoft.Practices.Unity;
using zic_dotnet;
using Board.Web.ViewModels;
using Board.Web.Helper;
using Board.Service;

namespace Board.Web.Controllers {
    [Authorize]
    public class SeatController : Controller {

        [Dependency]
        public ISeatGet seat_get { get; set; }
        [Dependency]
        public ISeatSub seat_sub { get; set; }
        [Dependency]
        public IItemGet item_get { get; set; }
        [Dependency]
        public IItemSub item_sub { get; set; }
        [Dependency]
        public IUserGet user_get { get; set; }
        [Dependency]
        public IUserSub user_sub { get; set; }

        public ActionResult Use() {
            UseCache();
            ViewBag.Itemtemp = item_get.ItemtempGetAll();
            UserIdentity user_identity = (UserIdentity)ViewBag.UserModel;

            mUser user = user_get.UserGet(user_identity.Id);
            ViewBag.UserStore = user.StoreData;
            IEnumerable<mFolder> nodes = seat_get.UseNode(user.Id);
            ViewBag.Nodes = JsonHelper.JsonSerializer<IEnumerable<mFolder>>(nodes);
            ViewBag.CusFolder = user.CusFolder;
            return View();
        }
        [NonAction]
        public void UseCache() {
            string path = Server.MapPath("/Js/cachedata.js");
            FileInfo objFI = new FileInfo(path);
            if (objFI.LastWriteTime.AddMinutes(5) > DateTime.Now) return;
            StreamWriter sw = System.IO.File.CreateText(path);

            IList<mSelprop> selprops = item_get.SelpropGetAll();
            sw.WriteLine("var glo_selprops = " + JsonHelper.JsonSerializer<IList<mSelprop>>(selprops) + ";");

            IList<mItemTemp> itemtemps = item_get.ItemtempGetAll();
            sw.WriteLine("var glo_itemtemps = " + JsonHelper.JsonSerializer<IList<mItemTemp>>(itemtemps) + ";");

            sw.Close();
        }
        [HttpPost]
        public JsonResult UseUpdateCusNodes(string cus_nodes) {
            UserIdentity user_identity = (UserIdentity)ViewBag.UserModel;
            mUser user = user_get.UserGet(user_identity.Id);
            user.CusFolder = cus_nodes;
            try {
                user_sub.UserUpdate(user);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }
        [AuthorizeUseSeat]
        [HttpPost]
        public JsonResult UseInject(int seatid) {
            mSeat seat = seat_get.SeatGet(seatid);
            if (seat == null)
                return Json(new { result = false, msg = "布告栏不存在。" });

            UserIdentity user = (UserIdentity)ViewBag.UserModel;
            mUser EditingUser = null;
            if (seat.EditUserId != 0) {
                EditingUser = user_get.UserGet(seat.EditUserId);
                if (EditingUser.Id == int.Parse(user.Id))
                    EditingUser = null;
            }

            IEnumerable<mAuth> auths = user_get.AuthGetByuser(int.Parse(user.Id));
            auths = auths.Where(a => a.Type == eAuthType.UseSeatProp && a.Key1 == seat.Id);

            if (EditingUser == null) {
                try {
                    seat_sub.SeatUpdateUserConcurrent(int.Parse(user.Id), seat.Id);
                } catch (Exception ex) {
                    return Json(new { result = false, msg = ex.Message });
                }
                return Json(new { seat = seat, propauth = auths });
            } else {
                return Json(new { attention = true, msg = "用户" + EditingUser.Name + "正在编辑这个布告栏，现在你只能查看无法提交更新。", seat = seat, propauth = auths });
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UseUpdate(int seatId, string defineJson, string cache, string userstore) {
            UserIdentity user = (UserIdentity)ViewBag.UserModel;
            mSeat seat = seat_get.SeatGet(seatId);
            try {
                if (seat.EditUserId != 0 && int.Parse(user.Id) != seat.EditUserId)
                    throw new ConcurrentException();

                mSeat upseat = new mSeat {
                    Id = seatId,
                    DefineJson = defineJson,
                    Cache = cache
                };
                seat_sub.SeatUpdateByuser(upseat, int.Parse(user.Id));
                mUser upuser = new mUser {
                    Id = int.Parse(user.Id),
                    StoreData = userstore
                };
                user_sub.UserUpdate(upuser);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }

        public ActionResult List(int pageindex) {
            UserIdentity user = (UserIdentity)ViewBag.UserModel;
            Pager<mSeat> seats = seat_get.SeatGetByauthPager(int.Parse(user.Id), 10, pageindex);
            return View(seats);
        }
        public ActionResult Delete(int id) {
            seat_sub.SeatDelete(id);
            return RedirectToAction("List", "Seat");
        }
        public ActionResult Creat() {
            ViewBag.FoldersSel = seat_get.FolderGetAll().ToSelectListItem("0", s => s.Name, s => s.Id.ToString(), "根目录");
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult Creat(string name, int parentId, string tempjson, string definejson) {
            if (seat_get.SeatCheckNameExist(name)) {
                return Json(new { result = false, msg = "名称已存在，请换一个。" });
            }
            mSeat newseat = new mSeat {
                Name = name,
                ParentFolderId = parentId,
                TempJson = tempjson,
                DefineJson = definejson
            };
            try {
                seat_sub.SeatAdd(newseat);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CreatByhtml(string name, int parentId, string temphtml, string definejson) {
            mSeat newseat = new mSeat {
                Name = name,
                ParentFolderId = parentId,
                TempHtml = temphtml,
                DefineJson = definejson
            };
            try {
                seat_sub.SeatAdd(newseat);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }
        public ActionResult Index(int id) {
            mSeat seat = seat_get.SeatGet(id);
            ViewBag.Seat = seat;
            ViewBag.FoldersSel = seat_get.FolderGetAll().ToSelectListItem(seat.ParentFolderId.ToString(), s => s.Name, s => s.Id.ToString(), "根目录");
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult Index(int seatid, string name, int parentId, string tempjson, string definejson) {
            mSeat seat = new mSeat {
                Id = seatid,
                Name = name,
                ParentFolderId = parentId,
                TempJson = tempjson,
                DefineJson = definejson
            };
            try {
                seat_sub.SeatUpdatetemp(seat);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult IndexByhtml(int seatid, string name, int parentId, string temphtml, string definejson) {
            mSeat seat = new mSeat {
                Name = name,
                ParentFolderId = parentId,
                TempHtml = temphtml,
                DefineJson = definejson
            };
            try {
                seat_sub.SeatUpdatetemp(seat);
            } catch (Exception ex) {
                return Json(new { result = false, msg = ex.Message });
            }
            return Json(new { result = true });
        }

        public ActionResult Front(int id) {
            mSeat seat = seat_get.SeatGet(id);
            return View(seat);
        }

        public ActionResult History(int id, int pageindex) {
            Pager<mSeatHistory> seathis = seat_get.SeatHistoryGetByseatPager(id, 10, pageindex);
            if (seathis.Result.Count() > 0) {
                ViewBag.SeatName = seathis.Result.First().SeatName;
            } else {
                ViewBag.SeatName = seat_get.SeatGet(id).Name;
            }
            return View(seathis);
        }
    }
}