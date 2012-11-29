using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Practices.Unity;

namespace Board.Web.Helper {
    public class MyDependencyResolver : IDependencyResolver {
        private IUnityContainer container;
        public MyDependencyResolver(IUnityContainer container) {
            this.container = container;
        }
        public object GetService(Type serviceType) {
            try {
                return container.Resolve(serviceType);
            } catch {
                return null;
            }
        }
        public IEnumerable<object> GetServices(Type serviceType) {
            try {
                return container.ResolveAll(serviceType);
            } catch {
                return new List<object>();
            }
        }
    }
}