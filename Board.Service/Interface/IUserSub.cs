using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;
using zic_dotnet;

namespace Board.Service {

    public interface IUserSub {
        bool ChangePassword(int id, string oldPwd, string newPwd);
        int UserAdd(mUser user);
        int UserAddByrole(mUser user, string rolename);
        mUser UserUpdate(mUser upuser);
        void UserDelete(int id);

        int RoleAdd(mRole role);
        void RoleAdduser(int userid, int roleid);
        void RoleRemoveuser(int userid, int roleid);
        void RoleAddauth(int authid, int roleid);
        void RoleRemoveauth(int authid, int roleid);
        mRole RoleUpdate(mRole uprole);
        void RoleDelete(int id);

        int AuthAdd(mAuth auth);
        mAuth AuthUpdate(mAuth upauth);
        void AuthDelete(int id);

        void SubmitChanges();
    }
}
