using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class SeatRepository : RepositoryBase<Seat> {
        public SeatRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }
    }
}