using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Data {
    public class RoleRepository : RepositoryBase<Role> {
        public RoleRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory) {
        }

        public Pager<User> GetUsers(int roleid, int psize, int pindex) {
            var query = from u in DataContext.User
                        where u.UserToRole.Any(d => d.roleId == roleid)
                        select u;
            Pager<User> pager = new Pager<User>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public Pager<User> GetUnUsers(int roleid, int psize, int pindex) {
            var query = from u in DataContext.User
                        where u.UserToRole.Count == 0 || u.UserToRole.All(d => d.roleId != roleid)
                        select u;
            Pager<User> pager = new Pager<User>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public Pager<Auth> GetAuths(int roleid, string search, int psize, int pindex, IEnumerable<int> types) {
            var query = from a in DataContext.Auth
                        where a.AuthToRole.Any(d => d.roleId == roleid) && types.Contains(a.type)
                        select a;
            if (!string.IsNullOrEmpty(search)) query = query.Where(d => d.name.Contains(search));
            Pager<Auth> pager = new Pager<Auth>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public Pager<Auth> GetUnAuths(int roleid, string search, int psize, int pindex, IEnumerable<int> types) {
            var query = from a in DataContext.Auth
                        where (a.AuthToRole.Count == 0 || a.AuthToRole.All(d => d.roleId != roleid)) && types.Contains(a.type)
                        select a;
            if (!string.IsNullOrEmpty(search)) query = query.Where(d => d.name.Contains(search));
            Pager<Auth> pager = new Pager<Auth>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }

        public void AddAuth(int roleid, int authid) {
            DataContext.AuthToRole.InsertOnSubmit(new AuthToRole { 
                authId = authid,
                roleId = roleid
            });
        }

        public void RemoveAuth(int roleid, int authid) {
            var atr = DataContext.AuthToRole.Where(d=>d.roleId == roleid && d.authId == authid);
            DataContext.AuthToRole.DeleteAllOnSubmit(atr);
        }

        public void AddUser(int roleid, int userid) {
            DataContext.UserToRole.InsertOnSubmit(new UserToRole {
                userId = userid,
                roleId = roleid
            });
        }

        public void RemoveUser(int roleid, int userid) {
            IQueryable<UserToRole> utr = DataContext.UserToRole.Where(d => d.roleId == roleid && d.userId == userid);
            DataContext.UserToRole.DeleteAllOnSubmit(utr);
        }

        public void Remove(Role role) {
            DataContext.AuthToRole.DeleteAllOnSubmit(role.AuthToRole);
            DataContext.UserToRole.DeleteAllOnSubmit(role.UserToRole);
            DataContext.Role.DeleteOnSubmit(role);
        }
    }

}