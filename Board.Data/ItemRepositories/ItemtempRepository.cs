using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class ItemtempRepository : RepositoryBase<Itemtemp> {
        public ItemtempRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }
    }
}
