using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {

    public class ServiceItem : Submit, IItemGet, IItemSub {
        private readonly ItemtempRepository itemtemp_repo;
        private readonly SelpropRepository prop_repo;
        public ServiceItem(
            ItemtempRepository itemtempRepo,
            SelpropRepository propRepo,
            UnitOfWork unit)
            : base(unit) {
            this.itemtemp_repo = itemtempRepo;
            this.prop_repo = propRepo;
        }

        public mItemTemp ItemtempGet(int id) {
            Itemtemp item = itemtemp_repo.Get(d => d.id == id);
            return new mItemTemp(item);
        }
        public IList<mItemTemp> ItemtempGetAll() {
            return itemtemp_repo.GetAll().Select(d => new mItemTemp(d)).ToList();
        }
        public int ItemtempAdd(mItemTemp itemtemp) {
            Itemtemp newitem = new Itemtemp();
            itemtemp_repo.Add(itemtemp.ToDb(newitem));
            SubmitChanges();
            return newitem.id;
        }
        public mItemTemp ItemtempUpdate(mItemTemp upitem) {
            Itemtemp item = itemtemp_repo.Get(d => d.id == upitem.Id);
            upitem.ToDb(item);
            SubmitChanges();
            return new mItemTemp(item);
        }
        public void ItemtempDelete(int id) {
            Itemtemp itemtemp = itemtemp_repo.Get(d => d.id == id);
            itemtemp_repo.Delete(itemtemp);
            SubmitChanges();
        }

        public mSelprop SelpropGet(int id) {
            return new mSelprop(prop_repo.Get(d => d.id == id));
        }
        public Pager<mSelprop> SelpropGetPager(int psize, int pindex) {
            Pager<mSelprop> pager = new Pager<mSelprop>();
            var query = prop_repo.GetAll();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query.Select(d => new mSelprop(d));
            return pager;
        }
        public Pager<mSelprop> SelpropGetBytypePager(eSelpropType type, int psize, int pindex) {
            Pager<mSelprop> pager = new Pager<mSelprop>();
            var query = prop_repo.GetMulti(d => d.type == (int)type);
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query.Select(d => new mSelprop(d));
            return pager;
        }
        public IList<mSelprop> SelpropGetAll() {
            return prop_repo.GetMulti(d => d.act == 0).Select(d => new mSelprop(d)).ToList();
        }
        public int SelpropAdd(mSelprop prop) {
            Selprop newprop = new Selprop();
            prop_repo.Add(prop.ToDb(newprop));
            SubmitChanges();
            return newprop.id;
        }
        public mSelprop SelpropUpdate(mSelprop upprop) {
            Selprop item = prop_repo.Get(d => d.id == upprop.Id);
            upprop.ToDb(item);
            SubmitChanges();
            return new mSelprop(item);
        }
        public void SelpropDelete(int id) {
            Selprop prop = prop_repo.Get(d => d.id == id);
            prop_repo.Delete(prop);
            SubmitChanges();
        }

    }
}
