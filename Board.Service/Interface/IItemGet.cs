using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {
    public interface IItemGet {

        mItemTemp ItemtempGet(int id);
        IList<mItemTemp> ItemtempGetAll();

        mSelprop SelpropGet(int id);
        Pager<mSelprop> SelpropGetPager(int psize, int pindex);
        Pager<mSelprop> SelpropGetBytypePager(eSelpropType type, int psize, int pindex);
        IList<mSelprop> SelpropGetAll();
    }
}
