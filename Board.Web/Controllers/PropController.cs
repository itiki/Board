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
    public class PropController : Controller {

        [Dependency]
        public IItemGet item_get { get; set; }
        [Dependency]
        public IItemSub item_sub { get; set; }

        public ActionResult List(int pageindex, string type) {
            Pager<mSelprop> props;
            if (string.IsNullOrEmpty(type)) {
                props = item_get.SelpropGetPager(10, pageindex);
            } else {
                props = item_get.SelpropGetBytypePager((eSelpropType)int.Parse(type), 10, pageindex);
            }
            if (props.Count == 0)
                return RedirectToAction("List", "Prop", new { id = --pageindex });
            InitTypeSel(type);
            return View(props);
        }

        public ActionResult Index(int id) {
            mSelprop prop = item_get.SelpropGet(id);
            PropModel prop_mod = new PropModel {
                Name = prop.Name,
                Type = Convert.ToInt32(prop.PropType).ToString(),
                ClassName = prop.ClassName,
            };
            InitTypeSel(prop_mod.Type);
            return View(prop_mod);
        }
        [HttpPost]
        public ActionResult Index(int id, PropModel prop_mod) {
            InitTypeSel(prop_mod.Type);
            if (!ModelState.IsValid) return View(prop_mod);
            mSelprop prop = item_get.SelpropGet(id);
            prop.Name = prop_mod.Name;
            prop.ClassName = prop_mod.ClassName;
            prop.PropType = (eSelpropType)int.Parse(prop_mod.Type);
            item_sub.SelpropUpdate(prop);
            return View(prop_mod);
        }

        public ActionResult Creat() {
            PropModel prop_mod = new PropModel();
            prop_mod.Type = ((int)eSelpropType.Color).ToString();
            InitTypeSel(String.Empty);
            return View(prop_mod);
        }
        [HttpPost]
        public ActionResult Creat(PropModel prop_mod) {
            if (!ModelState.IsValid) return View(prop_mod);
            mSelprop prop = new mSelprop {
                Name = prop_mod.Name,
                ClassName = prop_mod.ClassName,
                PropType = (eSelpropType)int.Parse(prop_mod.Type)
            };
            item_sub.SelpropAdd(prop);
            return RedirectToAction("List", "Prop", new { id = 1 });
        }

        [NonAction]
        public void InitTypeSel(string selvalue) {
            List<EnumItem> enums = Enumhelp.ListTypeForEnum(typeof(eSelpropType));
            ViewBag.TypeList = enums.ToSelectListItem(selvalue, s => s.Text, s => s.Value.ToString(), "");
        }

        public ActionResult Delete(int id, int pageindex) {
            item_sub.SelpropDelete(id);
            return RedirectToAction("List", "Prop", new { id = pageindex});
        }

    }
}
