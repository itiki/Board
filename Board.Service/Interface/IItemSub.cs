using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {
    public interface IItemSub {

        int ItemtempAdd(mItemTemp itemtemp);
        mItemTemp ItemtempUpdate(mItemTemp itemtemp);
        void ItemtempDelete(int id);

        int SelpropAdd(mSelprop user);
        mSelprop SelpropUpdate(mSelprop selprop);
        void SelpropDelete(int id);

        void SubmitChanges();
    }
}
