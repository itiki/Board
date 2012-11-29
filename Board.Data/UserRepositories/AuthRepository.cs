using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Data {
    public class AuthRepository : RepositoryBase<Auth> {
        public AuthRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }

        public IList<Role> GetRoles(int authId) {
            var query = from a in DataContext.Auth
                        from atr in a.AuthToRole
                        where a.id == authId
                        select atr.Role;
            return query.ToList();
        }

        public Pager<User> GetUsers(int authId, int psize, int pindex) {
            var query = from utr in DataContext.UserToRole
                        from atr in DataContext.AuthToRole
                        where atr.authId == authId && atr.roleId == utr.roleId
                        select utr.User;
            Pager<User> pager = new Pager<User>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public void Remove(Auth auth) {
            DataContext.AuthToRole.DeleteAllOnSubmit(auth.AuthToRole);
            DataContext.Auth.DeleteOnSubmit(auth);
        }
    }


}