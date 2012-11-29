using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {
    public interface ISeatSub {

        int SeatAdd(mSeat user);
        mSeat SeatUpdateByuser(mSeat upseat, int userId);
        void SeatUpdateUserConcurrent(int userId, int seatId);
        mSeat SeatUpdatetemp(mSeat upseat);
        void SeatDelete(int id);

        void SubmitChanges();
    }
}
