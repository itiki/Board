define(function (require, exports) {
    exports.C15ToC18 = function (c15) {
        var cId;
        if (!exports.isdate("19" + c15.substring(4, 8), c15.substring(8, 10), c15.substring(10, 12))) {
            alert("身份证号码中所含日期不正确");
            return;
        }
        cId = c15.substring(0, 6) + "19" + c15.substring(6, 15);
        var strJiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
        var intQuan = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
        var intTemp = 0;
        for (i = 0; i < cId.length - 1; i++)
            intTemp += cId.substring(i, i + 1) * intQuan[i];
        intTemp %= 11;
        cId += +strJiaoYan[intTemp];
        return cId;
    }

    exports.isdate = function (intYear, intMonth, intDay) {
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
        if (intMonth > 12 || intMonth < 1) return false;
        if (intDay < 1 || intDay > 31) return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30)) return false;
        if (intMonth == 2) {
            if (intDay > 29) return false;
            if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0)) && (intDay > 28)) return false;
        }
        return true;
    }

    exports.getBirthday = function (id) {
        return id.slice(6, 10) + "-" + id.slice(10, 12) + "-" + id.slice(12, 14);
    }

    exports.checkIsIdno = function (idcard) {
        var Errors = new Array("",
        "身份证号码位数不对！",
        "身份证号码出生日期超出范围或含有非法字符！",
        "身份证号码校验错误！",
        "身份证地区非法！",
        "身份证号码中不能有空格！");

        if ((idcard.match(/\s/)) != null)  return Errors[5];

        var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
        var idcard, Y, JYM;
        var S, M;
        var idcard_array = new Array();
        idcard_array = idcard.split("");

        //地区检验
        if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
        //身份号码位数及格式检验
        switch (idcard.length) {

            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                    //测试出生日期的合法性
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
                } else {
                    //测试出生日期的合法性
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
                }
                if (ereg.test(idcard)) {
                    return Errors[0];
                }
                else {
                    return Errors[2];
                }
                break;
            case 18:
                //18位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard)) {//测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                        + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y, 1); //判断校验位
                    if (M == 'X' && (idcard_array[17] == 'X' || idcard_array[17] == 'x')) {
                        return Errors[0];
                    }
                    if (M == idcard_array[17]) {
                        return Errors[0]; //检测ID的校验位
                    } else {
                        return Errors[3];
                    }
                } else {
                    return Errors[2];
                }
                break;
            default:
                return Errors[1];
                break;
        }
        return Errors[0];
    }

    exports.checkAdult = function (idcard) {
        var iscard = exports.checkIsIdno(idcard);
        if (iscard != "")
            return iscard;

        var t = new Date();
        var nowYear = parseInt(t.getFullYear());
        var nowMonth = parseInt(t.getMonth() + 1);
        var nowDay = parseInt(t.getDate());

        var breg
        if (idcard.length == 18) {
            breg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})(\d|x|X)$/;
        } else {
            breg = /^(d{6})(d{2})(d{2})(d{2})(d{3})$/;
        }
        var ok = true;
        var birth = idcard.match(breg);
        var birthYear = parseInt(birth[2]);
        if ((birthYear + 18) > nowYear) {
            ok = false;
        } else if ((birthYear + 18) == nowYear) {
            var birthMonth = parseInt(birth[3]);
            if (birthMonth > nowMonth) {
                ok = false;
            } else if (birthMonth = nowMonth) {
                var birthDay = parseInt(birth[4]);
                if (birthDay > nowDay) ok = false;
            }
        }

        if (ok)
            return "ok";
        else
            return "您未年满18周岁";
    }

});