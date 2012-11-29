using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Service {
    public enum eSelpropType {
        [EnumDescription("图标")]
        Ico = 1,
        [EnumDescription("文字颜色")]
        Color = 2,
        [EnumDescription("文字大小")]
        Fsize = 3,
        [EnumDescription("背景色")]
        BackColor = 4,
        [EnumDescription("特性")]
        Feature = 5
    }
}
