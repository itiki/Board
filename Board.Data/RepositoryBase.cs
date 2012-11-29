using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using Microsoft.Practices.EnterpriseLibrary.ExceptionHandling;

namespace Board.Data {
    public abstract class RepositoryBase<T> where T : class {

        protected DatabaseFactory DatabaseFactory { get; private set; }
        protected RepositoryBase(DatabaseFactory databaseFactory) {
            DatabaseFactory = databaseFactory;
            dataContext = DataContext;
        }
        private BoardDataContext dataContext;
        protected BoardDataContext DataContext {
            get { return dataContext ?? (dataContext = DatabaseFactory.Get()); }
        }

        public virtual void Add(T entity) {
            try {
                dataContext.GetTable<T>().InsertOnSubmit(entity);
            } catch (Exception ex) {
                if (ExceptionPolicy.HandleException(ex, "Policy"))
                    throw;
            }
        }

        public virtual void Delete(T entity) {
            try {
                dataContext.GetTable<T>().DeleteOnSubmit(entity);
            } catch (Exception ex) {
                if (ExceptionPolicy.HandleException(ex, "Policy"))
                    throw;
            }
        }

        public virtual void Delete(Expression<Func<T, bool>> where) {
            IEnumerable<T> objects = dataContext.GetTable<T>().Where<T>(where).AsEnumerable();
            foreach (T obj in objects)
                dataContext.GetTable<T>().DeleteOnSubmit(obj);
        }

        public virtual IQueryable<T> GetAll() {
            return dataContext.GetTable<T>();
        }

        public virtual IQueryable<T> GetMulti(Expression<Func<T, bool>> where) {
            return dataContext.GetTable<T>().Where(where);
        }

        public T Get(Expression<Func<T, bool>> where) {
            return dataContext.GetTable<T>().Where(where).FirstOrDefault<T>();
        }
    }
}
