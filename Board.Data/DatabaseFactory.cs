using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Data {
    public class DatabaseFactory : Disposable {
        private BoardDataContext dataContext;
        public BoardDataContext Get() {
            return dataContext ?? (dataContext = new BoardDataContext());
        }
        protected override void DisposeCore() {
            if (dataContext != null)
                dataContext.Dispose();
        }
    }

    public class Disposable : IDisposable {
        private bool isDisposed;

        ~Disposable() {
            Dispose(false);
        }

        public void Dispose() {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        private void Dispose(bool disposing) {
            if (!isDisposed && disposing) {
                DisposeCore();
            }
            isDisposed = true;
        }

        protected virtual void DisposeCore() {
        }
    }
}
