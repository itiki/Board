using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class SelpropRepository : RepositoryBase<Selprop> {
        public SelpropRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }
    }
}
