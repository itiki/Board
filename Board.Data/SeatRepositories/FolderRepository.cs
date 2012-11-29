using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class FolderRepository : RepositoryBase<Folder> {
        public FolderRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }
    }
}