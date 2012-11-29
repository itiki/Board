using System;
using System.ServiceModel.Activation;
using System.Web;
using System.Web.Routing;
using Microsoft.Practices.Unity;
using Board.Data;

namespace Board.Service {
    public class Global : HttpApplication {
        void Application_Start(object sender, EventArgs e) {
            RegisterRoutes();
            RestRegisterTypes();
        }

        private void RegisterRoutes() {
            // Edit the base address of Service1 by replacing the "Service1" string below
            RouteTable.Routes.Add(new ServiceRoute("rest", new WebServiceHostFactory(), typeof(Rest)));
        }

        public static IUnityContainer RestContainer { get; set; }

        protected virtual void RestRegisterTypes() {
            RestContainer
            .RegisterType<DatabaseFactory, DatabaseFactory>(new ContainerControlledLifetimeManager())
            .RegisterType<UnitOfWork, UnitOfWork>(new ContainerControlledLifetimeManager())
            .RegisterType<AuthRepository, AuthRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<UserRepository, UserRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<RoleRepository, RoleRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<ItemtempRepository, ItemtempRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<SeatHistoryRepository, SeatHistoryRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<SelpropRepository, SelpropRepository>(new ContainerControlledLifetimeManager())
            .RegisterType<IItemGet, ServiceItem>(new ContainerControlledLifetimeManager())
            .RegisterType<IItemSub, ServiceItem>(new ContainerControlledLifetimeManager())
            .RegisterType<ISeatGet, ServiceSeat>(new ContainerControlledLifetimeManager())
            .RegisterType<ISeatSub, ServiceSeat>(new ContainerControlledLifetimeManager())
            .RegisterType<IUserGet, ServiceUser>(new ContainerControlledLifetimeManager())
            .RegisterType<IUserSub, ServiceUser>(new ContainerControlledLifetimeManager());
        }
    }
}
