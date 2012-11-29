using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Board.Data;
using Board.Service;
using Microsoft.Practices.Unity;

namespace Board.Service {

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    public class Rest {
        public Rest() {
            user_get = Global.RestContainer.Resolve<IUserGet>();
            user_sub = Global.RestContainer.Resolve<IUserSub>();
            item_get = Global.RestContainer.Resolve<IItemGet>();
            item_sub = Global.RestContainer.Resolve<IItemSub>();
            seat_get = Global.RestContainer.Resolve<ISeatGet>();
            seat_sub = Global.RestContainer.Resolve<ISeatSub>();
        }
        public IUserGet user_get { get; set; }
        public IUserSub user_sub { get; set; }
        public IItemGet item_get { get; set; }
        public IItemSub item_sub { get; set; }
        public ISeatGet seat_get { get; set; }
        public ISeatSub seat_sub { get; set; }

        #region /role/{name} GET POST PUT DELETE
        [WebGet(UriTemplate = "/role")]
        public IList<mRole> RoleGetAll() {
            return user_get.RoleGetAll();
        }

        [WebGet(UriTemplate = "/role/{name}")]
        public mRole RoleGet(string name) {
            return user_get.RoleGet(name);
        }

        [WebInvoke(UriTemplate = "/role", Method = "POST")]
        public int RoleAdd(mRole newrole) {
            try {
                return user_sub.RoleAdd(newrole);
            } catch (Exception) {
                return 0;
            }
        }

        [WebInvoke(UriTemplate = "/role", Method = "PUT")]
        public mRole RoleUpdate(mRole uprole) {
            try {
                return user_sub.RoleUpdate(uprole);
            } catch (Exception) {
                return null;
            }
        }

        [WebInvoke(UriTemplate = "/role/{id}", Method = "DELETE")]
        public bool Delete(string id) {
            try {
                user_sub.RoleDelete(int.Parse(id));
                return true;
            } catch (Exception) {
                return false;
            }
        }
        #endregion

    }
}