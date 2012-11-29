using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Practices.EnterpriseLibrary.ExceptionHandling;

namespace Board.Data {
    public class UnitOfWork {
        private readonly DatabaseFactory databaseFactory;
        private BoardDataContext dataContext;

        public UnitOfWork(DatabaseFactory databaseFactory) {
            this.databaseFactory = databaseFactory;
        }

        protected BoardDataContext DataContext {
            get { return dataContext ?? (dataContext = databaseFactory.Get()); }
        }

        public void SubmitChanges() {
            try {
                DataContext.SubmitChanges();
            } catch (Exception ex) {
                if (ExceptionPolicy.HandleException(ex, "Policy"))
                    throw;
            }
        }
    }
}
