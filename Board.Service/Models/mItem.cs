using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using Board.Data;

namespace Board.Service {

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mItemTemp {
        public mItemTemp(Itemtemp it) {
            Id = it.id;
            Act = (eAct)it.act;
            Name = it.name;
            ToHtml = it.toHtml;
            Props = it.props;
        }
        public Itemtemp ToDb(Itemtemp db) {
            if (!string.IsNullOrEmpty(Name)) db.name = Name;
            if (!string.IsNullOrEmpty(ToHtml)) db.toHtml = ToHtml;
            if (!string.IsNullOrEmpty(Props)) db.props = Props;
            db.act = (int)Act;
            return db;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string ToHtml { get; set; }
        [DataMember]
        public string Props { get; set; }
    }

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mSelprop {
        public mSelprop() {
        }
        public mSelprop(Selprop p) {
            Id = p.id;
            Act = (eAct)p.act;
            Name = p.name;
            ClassName = p.className;
            PropType = (eSelpropType)p.type;
        }
        public Selprop ToDb(Selprop db) {
            if (!string.IsNullOrEmpty(Name)) db.name = Name;
            if (!string.IsNullOrEmpty(ClassName)) db.className = ClassName;
            db.act = (int)Act;
            db.type = (int)PropType;
            return db;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string ClassName { get; set; }
        [DataMember]
        public eSelpropType PropType { get; set; }
    }

}