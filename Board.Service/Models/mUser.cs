using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Board.Service;
using Board.Data;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace Board.Service {

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mUser {
        public mUser() {
        }
        public mUser(User u) {
            Id = u.id;
            Act = (eAct)u.act;
            Name = u.name;
            Password = u.password;
            StoreData = u.storedata;
            CusFolder = u.cusfolder;
        }
        public User ToDb(User user) {
            if (!string.IsNullOrEmpty(Name)) user.name = Name;
            if (!string.IsNullOrEmpty(Password)) user.password = Password;
            if (!string.IsNullOrEmpty(StoreData)) user.storedata = StoreData;
            if (!string.IsNullOrEmpty(CusFolder)) user.cusfolder = CusFolder;
            user.act = (int)Act;
            return user;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string StoreData { get; set; }
        [DataMember]
        public string CusFolder { get; set; }
    }

    [DataContract(Namespace = "Board")]
    public class mRole {
        public mRole() {
        }
        public mRole(Role r) {
            Id = r.id;
            Act = (eAct)r.act;
            Name = r.name;
        }
        public Role ToDb(Role role) {
            role.act = (int)Act;
            if (!string.IsNullOrEmpty(Name)) role.name = Name;
            return role;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string Name { get; set; }

        public override string ToString() {
            return Name;
        }
    }

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mAuth {
        public mAuth(Auth a){
            Id = a.id;
            Act = (eAct)a.act;
            Name = a.name;
            Key1 = a.key1;
            Key2 = a.key2;
            Key3 = a.key3;
            Type = (eAuthType)a.type;
        }
        public Auth ToDb(Auth auth) {
            auth.act = (int)Act;
            auth.type = (int)Type;
            if (!string.IsNullOrEmpty(Name)) auth.name = Name;
            if (Key1.HasValue) auth.key1 = Key1.Value;
            if (Key2.HasValue) auth.key2 = Key2.Value;
            if (Key3.HasValue) auth.key3 = Key3.Value;
            return auth;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int? Key1 { get; set; }
        [DataMember]
        public int? Key2 { get; set; }
        [DataMember]
        public int? Key3 { get; set; }
        [DataMember]
        public eAuthType Type { get; set; }

        public override string ToString() {
            return Id + "-" + ((int)Act).ToString() + "-" + Name + "-" + Key1 + "-" + Key2 + "-" + Key3 + "-" + ((int)Type).ToString();
        }
        public mAuth(string authstr) {
            string[] autharr = authstr.Split('-');
            Id = Convert.ToInt32(autharr[0]);
            Act = (eAct)Convert.ToInt32(autharr[1]);
            Name = autharr[2];
            Key1 = Convert.ToInt32(autharr[3]);
            Key2 = Convert.ToInt32(autharr[4]);
            Key3 = Convert.ToInt32(autharr[5]);
            Type = (eAuthType)Convert.ToInt32(autharr[6]);
        }
    }
}