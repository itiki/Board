using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Board.Service;
using Microsoft.Practices.Unity;
using zic_dotnet;

namespace Board.Web.Helper {
    public class AuthorizeUseSeatAttribute : AuthorizeAttribute {

        public AuthorizeUseSeatAttribute() {
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext) {
            bool result = false;
            if (httpContext == null)
                throw new ArgumentNullException("httpContext");
            if (!httpContext.User.Identity.IsAuthenticated)
                return false;

            UserIdentity user = httpContext.User.GetIdentityUser();
            int seatId;
            if (int.TryParse(httpContext.Request["seatid"], out seatId)) {
                IList<mAuth> auths = new List<mAuth>();
                foreach (string authstr in user.Auths.Split(',')) {
                    auths.Add(new mAuth(authstr));
                }
                foreach (mAuth auth in auths) {
                    if (auth.Type == eAuthType.UseSeat) {
                        if (auth.Key1 == seatId)
                            result = true;
                    }
                }
            }

            if (!result) {
                httpContext.Response.StatusCode = 403;
            }
            return result;
        }

        public override void OnAuthorization(AuthorizationContext filterContext) {
            base.OnAuthorization(filterContext);
            if (filterContext.HttpContext.Response.StatusCode == 403) {
                filterContext.Result = new RedirectResult("/Account/LogOn");
            }
        }

    }

}
