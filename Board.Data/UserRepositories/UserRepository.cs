using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Data {
    public class UserRepository : RepositoryBase<User> {
        public UserRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }

        public IList<Role> GetRoles(int userId) {
            var query = from u in DataContext.User
                        from utr in u.UserToRole
                        where u.id == userId
                        select utr.Role;
            return query.ToList();
        }

        public Pager<Auth> GetAuths(int userId, int psize, int pindex) {
            var query = from utr in DataContext.UserToRole
                        from atr in DataContext.AuthToRole
                        where utr.userId == userId && atr.roleId == utr.roleId
                        select atr.Auth;
            Pager<Auth> pager = new Pager<Auth>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public IEnumerable<Auth> GetAuths(int userId) {
            return GetAuths(userId, 10000, 1).Result;
        }

        public void Remove(User user) {
            DataContext.UserToRole.DeleteAllOnSubmit(user.UserToRole);
            DataContext.User.DeleteOnSubmit(user);
        }

    }

}
