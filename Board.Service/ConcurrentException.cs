using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Board.Service {
    [Serializable]
    public class ConcurrentException : SystemException {
        public ConcurrentException():base("当前有人正在编辑本数据") {

        }
    }
}
