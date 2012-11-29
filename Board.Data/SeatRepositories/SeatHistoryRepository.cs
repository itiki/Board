using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class SeatHistoryRepository : RepositoryBase<SeatHistory> {
        public SeatHistoryRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }
    }
}