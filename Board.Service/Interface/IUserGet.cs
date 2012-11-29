using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {

    public interface IUserGet {
        mUser Login(string name, string pwd);
        mUser UserGet(int id);
        mUser UserGet(string name);
        Pager<mUser> UserGetPager(int psize, int pindex);
        Pager<mUser> UserGetByrolePager(int roleid, int psize, int pindex);
        Pager<mUser> UserGetByunrolePager(int roleid, int psize, int pindex);
        Pager<mUser> UserGetByauthPager(int authId, int psize, int pindex);
        bool UserCheckNameExist(string name);

        mRole RoleGet(int id);
        mRole RoleGet(string name);
        IList<mRole> RoleGetAll();
        IList<mRole> RoleGetByuser(int userId);
        IList<mRole> RoleGetByauth(int authId);
        bool RoleCheckNameExist(string rolename);

        mAuth AuthGet(int id);
        Pager<mAuth> AuthPropGetByroleWithsearchPager(int roleid, string search, int psize, int pindex);
        Pager<mAuth> AuthPropGetByunroleWithsearchPager(int roleid, string search, int psize, int pindex);
        Pager<mAuth> AuthUseGetByroleWithsearchPager(int roleid, string search, int psize, int pindex);
        Pager<mAuth> AuthUseGetByunroleWithsearchPager(int roleid, string search, int psize, int pindex);
        IList<mAuth> AuthGetByuser(int userid);
        Pager<mAuth> AuthGetByuserPager(int userid, int psize, int pindex);

    }
}
