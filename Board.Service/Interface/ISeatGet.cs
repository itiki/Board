using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {
    public interface ISeatGet {

        IList<mFolder> FolderGetAll();
        IEnumerable<mFolder> UseNode(int userid);

        bool SeatCheckNameExist(string name);
        mSeat SeatGet(int id);
        Pager<mSeat> SeatGetByauthPager(int userid, int psize, int pindex);

        mSeatHistory SeatHistoryGet(int id);
        Pager<mSeatHistory> SeatHistoryGetByseatPager(int seatId, int psize, int pindex);
    }
}
