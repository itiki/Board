define(function (require, exports, module) {

    exports.money = function (numberValue) {
        var numberValue = new String(Math.round(numberValue * 100)); // 数字金额  
        var chineseValue = ""; // 转换后的汉字金额  
        var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字  
        var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位  
        var len = numberValue.length; // numberValue 的字符串长度  
        var Ch1; // 数字的汉语读法  
        var Ch2; // 数字位的汉字读法  
        var nZero = 0; // 用来计算连续的零值的个数  
        var String3; // 指定位置的数值  
        if (len > 15) {
            alert("超出计算范围");
            return "";
        }
        if (numberValue == 0) {
            chineseValue = "零元整";
            return chineseValue;
        }
        String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
        for (var i = 0; i < len; i++) {
            String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值  
            if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
                if (String3 == 0) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                }
                else if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
            }
            else { // 该位是万亿，亿，万，元位等关键位  
                if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else if (String3 != 0 && nZero == 0) {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else if (String3 == 0 && nZero >= 3) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                }
                else {
                    Ch1 = "";
                    Ch2 = String2.substr(i, 1);
                    nZero = nZero + 1;
                }
                if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上  
                    Ch2 = String2.substr(i, 1);
                }
            }
            chineseValue = chineseValue + Ch1 + Ch2;
        }
        if (String3 == 0) { // 最后一位（分）为0时，加上“整”  
            chineseValue = chineseValue + "整";
        }
        return chineseValue;
    }

    exports.num = function (num) {
        if (!/^\d*(\.\d*)?$/.test(num)) return "零"
        var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var BB = new Array("", "拾", "佰", "仟", "万", "亿", "点", "");
        if (num == 0 || num == ".") return "零"
        var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, str = "";
        for (var i = a[0].length - 1; i >= 0; i--) //author: meizz
        {
            switch (k) {
                case 0: str = BB[7] + str; break;
                case 2: if (k % 4 == 2 && a[0].charAt(i + 1) == "0" && a[0].charAt(i + 2) != "0") str = AA[0] + str; break;
                case 3: if (a[0].charAt(i + 1) == "0" && a[0].charAt(i + 2) != "0") str = AA[0] + str; break;  
                case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        str = BB[4] + str; break;
                case 8: str = BB[5] + str; BB[7] = BB[5]; k = 0; break;
            }
            if (k % 4 == 2 && a[0].charAt(i) == "0" && a[0].charAt(i + 2) != "0") str = AA[0] + str;
            if (a[0].charAt(i) != 0) str = AA[a[0].charAt(i)] + BB[k % 4] + str; k++;
        }
        if (num < 1) str += AA[0];
        if (a.length > 1) //加上小数部分(如果有小数部分)
        {
            //str = str.substring(0, str.length - 1); 
            str += BB[6];
            for (var i = 0; i < a[1].length; i++) str += AA[a[1].charAt(i)];
            str += BB[0];
        }
        var arr = str.split("");
        deleteArr(arr);
        var str = arr.join("");
        return str;
    }
    function deleteArr(arr) {
        if (isTheSame(arr)) {
            var a = []
            for (var i = 0; i < arr.length - 1; i++) {
                if (arr[i] == arr[i + 1]) {
                    arr.splice(i + 1, 1);
                    deleteArr(arr);
                }
            }
            return arr;
        }
        else return arr;
    }
    function isTheSame(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) return true;
        }
    }
});