using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Board.Data;

namespace Board.Service {
    
    public abstract class Submit {
        private readonly UnitOfWork unit;
        public Submit(UnitOfWork unitOfWork){
            this.unit = unitOfWork;
        }

        public void SubmitChanges() {
            unit.SubmitChanges();
        }
    }
}
