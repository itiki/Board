using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Service {
    public enum eAuthType {
        [EnumDescription("使用布告栏")]
        UseSeat = 0,
        [EnumDescription("设置布告栏元素属性")]
        UseSeatProp = 1,
        [EnumDescription("编辑布告栏")]
        EditSeat = 2
    }
}