using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using zic_dotnet;

namespace Board.Service {
    public enum eItemPropType {
        [EnumDescription("文字")]
        Text = 11,
        [EnumDescription("链接")]
        Href = 12,
        [EnumDescription("文字提示语")]
        Title = 13,
        [EnumDescription("图片/图标")]
        Src = 14,
        [EnumDescription("图片提示语")]
        Alt = 15
    }
}
