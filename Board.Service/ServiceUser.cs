using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {

    public class ServiceUser : Submit, IUserGet, IUserSub {
        private readonly UserRepository user_repo;
        private readonly RoleRepository role_repo;
        private readonly AuthRepository auth_repo;
        public ServiceUser(
            UserRepository userRepo,
            RoleRepository roleRepo,
            AuthRepository authRepo,
            UnitOfWork unit)
            : base(unit) {
            this.user_repo = userRepo;
            this.role_repo = roleRepo;
            this.auth_repo = authRepo;
        }

        public mUser Login(string name, string pwd) {
            pwd = Encrypt.EncryptUserPassword(pwd);
            User user = user_repo.Get(d => d.name == name && d.password == pwd);
            if (user == null) return null;
            mUser muser = new mUser(user);
            return muser;
        }
        public bool ChangePassword(int id, string oldPwd, string newPwd) {
            oldPwd = Encrypt.EncryptUserPassword(oldPwd);
            var query = user_repo.Get(d => d.id == id && d.password == oldPwd);
            if (query != null) {
                newPwd = Encrypt.EncryptUserPassword(newPwd);
                query.password = newPwd;
                SubmitChanges();
                return true;
            }
            return false;
        }

        public mUser UserGet(int id) {
            User user = user_repo.Get(d => d.id == id);
            return new mUser(user);
        }
        public mUser UserGet(string username) {
            User user = user_repo.Get(d => d.name == username);
            return new mUser(user);
        }
        public Pager<mUser> UserGetPager(int psize, int pindex) {
            Pager<mUser> pager = new Pager<mUser>();
            var query = user_repo.GetAll();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query.Select(d => new mUser(d));
            return pager;
        }
        public Pager<mUser> UserGetByrolePager(int roleid, int psize, int pindex) {
            var users = role_repo.GetUsers(roleid, psize, pindex);
            return new Pager<mUser> {
                Count = users.Count,
                Result = users.Result.Select(d => new mUser(d))
            };
        }
        public Pager<mUser> UserGetByunrolePager(int roleid, int psize, int pindex) {
            var users = role_repo.GetUnUsers(roleid, psize, pindex);
            return new Pager<mUser> {
                Count = users.Count,
                Result = users.Result.Select(d => new mUser(d))
            };
        }
        public Pager<mUser> UserGetByauthPager(int authId, int psize, int pindex) {
            var auths = auth_repo.GetUsers(authId, psize, pindex);
            return new Pager<mUser> {
                Count = auths.Count,
                Result = auths.Result.Select(d => new mUser(d))
            };
        }
        public bool UserCheckNameExist(string name) {
            return user_repo.Get(d => d.name == name) != null;
        }
        public int UserAdd(mUser newuser) {
            newuser.Password = Encrypt.EncryptUserPassword(newuser.Password);
            User user = new User();
            user_repo.Add(newuser.ToDb(user));
            SubmitChanges();
            return user.id;
        }
        public int UserAddByrole(mUser user, string rolename) {
            int userid = UserAdd(user);
            RoleAdduser(userid, RoleGet(rolename).Id);
            return userid;
        }
        public mUser UserUpdate(mUser muser) {
            User user = user_repo.Get(d => d.id == muser.Id);
            muser.ToDb(user);
            SubmitChanges();
            return new mUser(user);
        }
        public void UserDelete(int id) {
            User user = user_repo.Get(d => d.id == id);
            user_repo.Remove(user);
            SubmitChanges();
        }

        public mRole RoleGet(int id) {
            Role role = role_repo.Get(d => d.id == id);
            return new mRole(role);
        }
        public mRole RoleGet(string name) {
            Role role = role_repo.Get(d => d.name == name);
            return new mRole(role);
        }
        public IList<mRole> RoleGetAll() {
            return role_repo.GetAll().Select(d => new mRole(d)).ToList();
        }
        public IList<mRole> RoleGetByuser(int userid) {
            return user_repo.GetRoles(userid).Select(d => new mRole(d)).ToList();
        }
        public IList<mRole> RoleGetByauth(int authId) {
            return auth_repo.GetRoles(authId).Select(d => new mRole(d)).ToList();
        }
        public bool RoleCheckNameExist(string rolename) {
            return role_repo.Get(d => d.name == rolename) != null;
        }
        public int RoleAdd(mRole mrole) {
            Role role = new Role();
            role_repo.Add(mrole.ToDb(role));
            SubmitChanges();
            return role.id;
        }
        public void RoleAdduser(int userid, int roleid) {
            role_repo.AddUser(roleid, userid);
            SubmitChanges();
        }
        public void RoleRemoveuser(int userid, int roleid) {
            role_repo.RemoveUser(roleid, userid);
            SubmitChanges();
        }
        public void RoleAddauth(int authid, int roleid) {
            role_repo.AddAuth(roleid, authid);
            SubmitChanges();
        }
        public void RoleRemoveauth(int authid, int roleid) {
            role_repo.RemoveAuth(roleid, authid);
            SubmitChanges();
        }
        public mRole RoleUpdate(mRole mrole) {
            Role role = role_repo.Get(d => d.id == mrole.Id);
            mrole.ToDb(role);
            SubmitChanges();
            return new mRole(role);
        }
        public void RoleDelete(int id) {
            Role role = role_repo.Get(d=>d.id == id);
            role_repo.Remove(role);
            SubmitChanges();
        }

        public mAuth AuthGet(int id) {
            Auth auth = auth_repo.Get(d => d.id == id);
            return new mAuth(auth);
        }
        public Pager<mAuth> AuthPropGetByroleWithsearchPager(int roleid, string search, int psize, int pindex) {
            IList<int> types = new List<int> { 
                (int)eAuthType.UseSeatProp
            };
            var users = role_repo.GetAuths(roleid, search, psize, pindex, types);
            return new Pager<mAuth> {
                Count = users.Count,
                Result = users.Result.Select(d => new mAuth(d))
            };
        }
        public Pager<mAuth> AuthPropGetByunroleWithsearchPager(int roleid, string search, int psize, int pindex) {
            IList<int> types = new List<int> { 
                (int)eAuthType.UseSeatProp
            };
            var users = role_repo.GetUnAuths(roleid, search, psize, pindex, types);
            return new Pager<mAuth> {
                Count = users.Count,
                Result = users.Result.Select(d => new mAuth(d))
            };
        }
        public Pager<mAuth> AuthUseGetByroleWithsearchPager(int roleid, string search, int psize, int pindex) {
            IList<int> types = new List<int> { 
                (int)eAuthType.EditSeat,
                (int)eAuthType.UseSeat
            };
            var users = role_repo.GetAuths(roleid, search, psize, pindex, types);
            return new Pager<mAuth> {
                Count = users.Count,
                Result = users.Result.Select(d => new mAuth(d))
            };
        }
        public Pager<mAuth> AuthUseGetByunroleWithsearchPager(int roleid, string search, int psize, int pindex) {
            IList<int> types = new List<int> { 
                (int)eAuthType.EditSeat,
                (int)eAuthType.UseSeat
            };
            var users = role_repo.GetUnAuths(roleid, search, psize, pindex, types);
            return new Pager<mAuth> {
                Count = users.Count,
                Result = users.Result.Select(d => new mAuth(d))
            };
        }
        public IList<mAuth> AuthGetByuser(int userid) {
            return user_repo.GetAuths(userid, 10000, 1).Result.Select(d => new mAuth(d)).ToList();
        }
        public Pager<mAuth> AuthGetByuserPager(int userid, int psize, int pindex) {
            var auths = user_repo.GetAuths(userid, psize, pindex);
            return new Pager<mAuth> {
                Count = auths.Count,
                Result = auths.Result.Select(d => new mAuth(d))
            };
        }
        public int AuthAdd(mAuth mauth) {
            Auth auth = new Auth();
            auth_repo.Add(mauth.ToDb(auth));
            SubmitChanges();
            return auth.id;
        }
        public mAuth AuthUpdate(mAuth mauth) {
            Auth auth = auth_repo.Get(d => d.id == mauth.Id);
            mauth.ToDb(auth);
            SubmitChanges();
            return new mAuth(auth);
        }
        public void AuthDelete(int id) {
            Auth auth = auth_repo.Get(d => d.id == id);
            auth_repo.Remove(auth);
            SubmitChanges();
        }
    }
}