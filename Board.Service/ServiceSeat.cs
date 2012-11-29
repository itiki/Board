using System;
using System.Collections.Generic;
using System.Linq;
using Board.Data;
using zic_dotnet;

namespace Board.Service {

    public class ServiceSeat : Submit, ISeatGet, ISeatSub {

        private readonly SeatHistoryRepository seathist_repo;
        private readonly SeatRepository seat_repo;
        private readonly FolderRepository folder_repo;
        private readonly AuthRepository auth_repo;
        private readonly UserRepository user_repo;
        public ServiceSeat(
            SeatHistoryRepository seathistRepo,
            SeatRepository seatRepo,
            AuthRepository authRepo,
            UserRepository userRepo,
            FolderRepository folderRepo,
            UnitOfWork unit)
            : base(unit) {
            this.seathist_repo = seathistRepo;
            this.seat_repo = seatRepo;
            this.auth_repo = authRepo;
            this.user_repo = userRepo;
            this.folder_repo = folderRepo;
        }

        public IList<mFolder> FolderGetAll() {
            return folder_repo.GetAll().Select(d => new mFolder(d)).ToList();
        }
        public IEnumerable<mFolder> UseNode(int userid) {
            var auths = user_repo.GetAuths(userid).Where(d => d.type == (int)eAuthType.UseSeat);
            var seats = seat_repo.GetMulti(d => auths.Any(a => a.key1 == d.id));
            var folders = folder_repo.GetMulti(f => seats.Any(s => s.parentFolderId == f.id));
            IList<mFolder> CusFolder = new List<mFolder>();
            CusFolder.Add(new mFolder {
                Id = 1000,
                Name = "收藏夹",
                Description = "收藏夹",
                open = true,
                isParent = true,
                iconSkin = "cus_folder"
            });
            return CusFolder
                .Union(folders.Select(d => new mFolder(d)))
                .Union(seats.Select(d => new mFolder(new mSeat(d))));
        }

        public bool SeatCheckNameExist(string name) {
            return seat_repo.Get(d => d.name == name) != null;
        }
        public mSeat SeatGet(int id) {
            Seat seat = seat_repo.Get(d => d.id == id);
            return new mSeat(seat);
        }
        public Pager<mSeat> SeatGetByauthPager(int userid, int psize, int pindex) {
            IEnumerable<Auth> auths = user_repo.GetAuths(userid, 10000, 1).Result.Where(d => d.type == (int)eAuthType.EditSeat);
            Pager<mSeat> pager = new Pager<mSeat>();
            var query = seat_repo.GetMulti(d => auths.Any(a => a.key1 == d.id)).Select(d => new mSeat(d));
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query;
            return pager;
        }
        public int SeatAdd(mSeat newseat) {
            Seat seat = new Seat();
            seat_repo.Add(newseat.ToDb(seat));
            SubmitChanges();
            Auth useseatauth = new Auth {
                name = EnumDescription.GetFieldText(eAuthType.UseSeat) + " - " + seat.name,
                type = (int)eAuthType.UseSeat,
                key1 = seat.id
            };
            auth_repo.Add(useseatauth);
            Auth editseatauth = new Auth {
                name = EnumDescription.GetFieldText(eAuthType.EditSeat) + " - " + seat.name,
                type = (int)eAuthType.EditSeat,
                key1 = seat.id
            };
            auth_repo.Add(editseatauth);
            foreach (eSelpropType etype in Enum.GetValues(typeof(eSelpropType))) {
                Auth selpropauth = new Auth {
                    name = EnumDescription.GetFieldText(eAuthType.UseSeatProp) + " - " + EnumDescription.GetFieldText(etype) + " - " + seat.name,
                    type = (int)eAuthType.UseSeatProp,
                    key1 = seat.id,
                    key2 = (int)etype
                };
                auth_repo.Add(selpropauth);
            }
            foreach (eItemPropType etype in Enum.GetValues(typeof(eItemPropType))) {
                Auth itempropauth = new Auth {
                    name = EnumDescription.GetFieldText(eAuthType.UseSeatProp) + " - " + EnumDescription.GetFieldText(etype) + " - " + seat.name,
                    type = (int)eAuthType.UseSeatProp,
                    key1 = seat.id,
                    key2 = (int)etype
                };
                auth_repo.Add(itempropauth);
            }
            SubmitChanges();
            return seat.id;
        }
        public mSeat SeatUpdateByuser(mSeat upseat, int userId) {
            Seat seat = seat_repo.Get(d => d.id == upseat.Id);
            upseat.ToDb(seat);
            var seathistory = seathist_repo.GetMulti(d => d.seatName == seat.name && d.endTime == null);
            foreach (SeatHistory item in seathistory) {
                item.endTime = DateTime.Now;
            }
            SeatHistory seathist = new SeatHistory {
                seatName = seat.name,
                startTime = DateTime.Now,
                userName = user_repo.Get(d => d.id == userId).name,
                cache = seat.cache
            };
            seathist_repo.Add(seathist);
            SubmitChanges();
            return new mSeat(seat);
        }
        public void SeatUpdateUserConcurrent(int userId, int seatId) {
            var seats = seat_repo.GetMulti(d => d.editingUser == userId);
            foreach (var seat in seats) {
                seat.editingUser = 0;
            }
            Seat upseat = seat_repo.Get(d => d.id == seatId);
            upseat.editingUser = userId;
            SubmitChanges();
        }
        public mSeat SeatUpdatetemp(mSeat upseat) {
            Seat seat = seat_repo.Get(d => d.id == upseat.Id);
            var auths_useseat = auth_repo.GetMulti(d => (d.type == (int)eAuthType.UseSeat || d.type == (int)eAuthType.EditSeat || d.type == (int)eAuthType.UseSeatProp) && d.key1 == upseat.Id);
            foreach (var auth in auths_useseat) {
                string[] strs = auth.name.SplitBystr(" - ", null);
                strs[strs.Length - 1] = upseat.Name;
                auth.name = String.Join(" - ", strs);
            }
            upseat.ToDb(seat);
            SubmitChanges();
            return new mSeat(seat);
        }
        public void SeatDelete(int id) {
            var auths = auth_repo.GetMulti(d => (d.type == (int)eAuthType.UseSeat || d.type == (int)eAuthType.EditSeat || d.type == (int)eAuthType.UseSeatProp) && d.key1 == id);
            foreach (var auth in auths) {
                auth_repo.Remove(auth);
            }
            seat_repo.Delete(d => d.id == id);
            SubmitChanges();
        }

        public mSeatHistory SeatHistoryGet(int id) {
            SeatHistory seath = seathist_repo.Get(d => d.id == id);
            return new mSeatHistory(seath);
        }
        public Pager<mSeatHistory> SeatHistoryGetByseatPager(int seatId, int psize, int pindex) {
            Seat seat = seat_repo.Get(d => d.id == seatId);
            var query = seathist_repo.GetMulti(d => d.seatName == seat.name);
            Pager<mSeatHistory> pager = new Pager<mSeatHistory>();
            pager.Count = query.Count();
            query = query.Skip(--pindex * psize).Take(psize);
            pager.Result = query.Select(d => new mSeatHistory(d));
            return pager;
        }

    }
}