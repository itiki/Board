using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.DynamicData;
using System.Web.Routing;
using Microsoft.Practices.Unity;
using System.ServiceModel.Activation;
using System.Web.Security;
using Board.Web.Helper;
using Board.Service;
using Board.Data;
using zic_dotnet;
using System.Security.Principal;

namespace Board.Web {

    public class MvcApplication : System.Web.HttpApplication {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new UserInject());
            filters.Add(new CompressResponseAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{resource}.aspx/{*pathInfo}");

            routes.MapRoute(
                "Index",
                "{controller}/{id}",
                new { action = "Index" },
                new { Id = @"\d+" }
            );
            routes.MapRoute(
                "List",
                "{controller}/List/{pageindex}/{type}",
                new { action = "List", pageindex = 1, type = UrlParameter.Optional }
            );
            routes.MapRoute(
                "CIA_list_active",
                "{controller}/{id}/{action}/{pageindex}/{itemid}",
                new { pageindex = 1, itemid = UrlParameter.Optional },
                new { Id = @"\d+" }
            );
            routes.MapRoute(
                "Default",
                "{controller}/{action}",
                new { controller = "Seat", action = "Use" }
            );
            
        }

        public override void Init() {
            this.PostAuthenticateRequest += SecurityExtensions.PostAuthenticateRequestHandler;
            base.Init();
        }

        public static IUnityContainer Container { get; private set; }

        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            Container = new UnityContainer();
            this.RegisterTypes();

            UrlBuild.ControlDeploy = UrlBuild.eControlDeploy.NoDeploy;
        }

        protected virtual void RegisterTypes() {
            Container
            .RegisterType<IFormsAuthentication, FormsAuthenticationWithAuths>(new ContainerControlledLifetimeManager())
            .RegisterType<DatabaseFactory, DatabaseFactory>(new HttpContextLifetimeManager<DatabaseFactory>())
            .RegisterType<UnitOfWork, UnitOfWork>(new HttpContextLifetimeManager<UnitOfWork>())
            .RegisterType<AuthRepository, AuthRepository>(new HttpContextLifetimeManager<AuthRepository>())
            .RegisterType<UserRepository, UserRepository>(new HttpContextLifetimeManager<UserRepository>())
            .RegisterType<RoleRepository, RoleRepository>(new HttpContextLifetimeManager<RoleRepository>())
            .RegisterType<ItemtempRepository, ItemtempRepository>(new HttpContextLifetimeManager<ItemtempRepository>())
            .RegisterType<SeatHistoryRepository, SeatHistoryRepository>(new HttpContextLifetimeManager<SeatHistoryRepository>())
            .RegisterType<SelpropRepository, SelpropRepository>(new HttpContextLifetimeManager<SelpropRepository>())
            .RegisterType<IItemGet, ServiceItem>(new HttpContextLifetimeManager<IItemGet>())
            .RegisterType<IItemSub, ServiceItem>(new HttpContextLifetimeManager<IItemSub>())
            .RegisterType<ISeatGet, ServiceSeat>(new HttpContextLifetimeManager<ISeatGet>())
            .RegisterType<ISeatSub, ServiceSeat>(new HttpContextLifetimeManager<ISeatSub>())
            .RegisterType<IUserGet, ServiceUser>(new HttpContextLifetimeManager<IUserGet>())
            .RegisterType<IUserSub, ServiceUser>(new HttpContextLifetimeManager<IUserSub>());

            DependencyResolver.SetResolver(new MyDependencyResolver(Container));
        }


    }

}