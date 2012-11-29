using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Board.Service;
using zic_dotnet;
using System.Web.Security;

namespace Board.Web.Helper {
    public class AuthenticationTicketBuilder {
        public static FormsAuthenticationTicket CreateTicket(mUser user, IList<mRole> roles, IList<mAuth> auths) {
            var userInfo = new UserIdentity {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Id.ToString(),
                Roles = String.Join(",", roles),
                Auths = String.Join(",", auths)
            };

            var ticket = new FormsAuthenticationTicket(1,
                user.Name,
                DateTime.Now,
                DateTime.Now.Add(FormsAuthentication.Timeout),
                false,
                userInfo.ToString());

            return ticket;
        }
    }
}