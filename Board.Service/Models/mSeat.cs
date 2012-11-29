using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using Board.Service;
using Board.Data;

namespace Board.Service {
    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mSeat {
        public mSeat() {
        }
        public mSeat(Seat s) {
            Id = s.id;
            Act = (eAct)s.act;
            ParentFolderId = s.parentFolderId;
            Name = s.name;
            Cache = s.cache;
            TempJson = s.tempJson;
            DefineJson = s.defineJson;
            EditUserId = s.editingUser;
        }
        public Seat ToDb(Seat upseat){
            if(!string.IsNullOrEmpty(Name)) upseat.name = Name;
            if(!string.IsNullOrEmpty(Cache)) upseat.cache = Cache;
            if(!string.IsNullOrEmpty(TempJson)) upseat.tempJson = TempJson;
            if(!string.IsNullOrEmpty(TempHtml)) upseat.tempHtml = TempHtml;
            if(!string.IsNullOrEmpty(DefineJson)) upseat.defineJson = DefineJson;
            upseat.act = (int)Act;
            if(ParentFolderId.HasValue) upseat.parentFolderId = ParentFolderId.Value;
            upseat.editingUser = EditUserId;
            return upseat;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public eAct Act { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int? ParentFolderId { get; set; }
        [DataMember]
        public string Cache { get; set; }
        [DataMember]
        public string TempJson { get; set; }
        [DataMember]
        public string TempHtml { get; set; }
        [DataMember]
        public string DefineJson { get; set; }
        [DataMember]
        public int EditUserId { get; set; }
    }

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mSeatHistory {
        public mSeatHistory(SeatHistory s) {
            Id = s.id;
            SeatName = s.seatName;
            Cache = s.cache;
            StartTime = s.startTime;
            EndTime = s.endTime;
            UserName = s.userName;
        }
        public SeatHistory ToDb(SeatHistory upseathis){
            if (!string.IsNullOrEmpty(Cache)) upseathis.cache = Cache;
            upseathis.seatName = SeatName;
            upseathis.userName = UserName;
            if (StartTime.HasValue) upseathis.startTime = StartTime.Value;
            if (EndTime.HasValue) upseathis.endTime = EndTime.Value;
            return upseathis;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string SeatName { get; set; }
        [DataMember]
        public string Cache { get; set; }
        [DataMember]
        public DateTime? StartTime { get; set; }
        [DataMember]
        public DateTime? EndTime { get; set; }
        [DataMember]
        public string UserName { get; set; }
    }

    [Serializable]
    [DataContract(Namespace = "Board")]
    public class mFolder {
        public mFolder() {
        }
        public mFolder(Folder f) {
            Id = f.id;
            ParentFolderId = f.parentFolderId;
            Name = f.name;
            Description = f.description;
            isParent = true;
        }
        public mFolder(mSeat s) {
            Id = s.Id;
            ParentFolderId = s.ParentFolderId;
            Name = s.Name;
            Description = s.Name;
            isParent = false;
        }
        public Folder ToDb(Folder upfolder) {
            if (!string.IsNullOrEmpty(Name)) upfolder.name = Name;
            if (!string.IsNullOrEmpty(Description)) upfolder.description = Description;
            if (ParentFolderId.HasValue) upfolder.parentFolderId = ParentFolderId.Value;
            return upfolder;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int? ParentFolderId { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public bool open { get; set; }
        [DataMember]
        public bool isParent { get; set; }
        [DataMember]
        public string iconSkin { get; set; }
    }
}