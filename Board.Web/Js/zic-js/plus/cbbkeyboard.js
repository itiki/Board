define(function (require, exports, module) {
    var $, softkeyboard, namepwd, eli;
    exports.init = function (jq) {
        $ = jq;
        InjectDom();
        softkeyboard = $("#softkeyboard")[0];
        namepwd = $('[name=password]', softkeyboard)[0];
        randomNumberButton();
        setCalcButtonBg();
        $("#useKey, #accept", softkeyboard).on('click', function () {
            exports.closekeyboard();
        });
        $('#backspace', softkeyboard).on('click', function () {
            setpassvalue();
        });
        $('#capslock', softkeyboard).on('click', function () {
            capsLockText();
            setCapsLock();
        });
    }
    var InjectDom = function () {
        var html = '<div id="softkeyboard" style="position: absolute; z-index: 180; display: none"><input type="hidden" value="" name="password" /><table><tr><td colspan="14" class="f13">东方财富网旗下基金交易平台 - 密码输入器</td><td><input id="useKey" class="btn_letter" style="width: 99px;" type="button" value="使用键盘输入" bgtype="1" /></td></tr><tr align="left" valign="middle"><td><input type="button" value=" ~ "></td><td><input type="button" value=" ! "></td><td><input type="button" value=" @ "></td><td><input type="button" value=" # "></td><td><input type="button" value=" $ "></td><td><input type="button" value=" % "></td><td><input type="button" value=" ^ "></td><td><input type="button" value=" & "></td><td><input type="button" value=" * "></td><td><input type="button" value=" ( "></td><td><input type="button" value=" ) "></td><td><input type="button" value=" _ "></td><td><input type="button" value=" + "></td><td><input type="button" value=" | "></td><td colspan="1" rowspan="2"><input id="backspace" name="button10" type="button" value=" 退格" style="width: 100px;height: 42px"></td></tr><tr align="left" valign="middle"><td><input type="button" value=" ` "></td><td><input type="button" bgtype="2" name="button_number1" value=" 1 "></td><td><input type="button" bgtype="2" name="button_number2" value=" 2 "></td><td><input type="button" bgtype="2" name="button_number3" value=" 3 "></td><td><input type="button" bgtype="2" name="button_number4" value=" 4 "></td><td><input type="button" bgtype="2" name="button_number5" value=" 5 "></td><td><input type="button" bgtype="2" name="button_number6" value=" 6 "></td><td><input type="button" bgtype="2" name="button_number7" value=" 7 "></td><td><input type="button" bgtype="2" name="button_number8" value=" 8 "></td><td><input type="button" bgtype="2" name="button_number9" value=" 9 "></td><td><input bgtype="2" name="button_number0" type="button" value=" 0 "></td><td><input type="button" value=" - "></td><td><input type="button" value=" = "></td><td><input type="button" value=" \ "></td><td></td></tr><tr align="left" valign="middle"><td><input type="button" value=" q "></td><td><input type="button" value=" w "></td><td><input type="button" value=" e "></td><td><input type="button" value=" r "></td><td><input type="button" value=" t "></td><td><input type="button" value=" y "></td><td><input type="button" value=" u "></td><td><input type="button" value=" i "></td><td><input type="button" value=" o "></td><td><input name="button8" type="button" value=" p "></td><td><input name="button9" type="button" value=" { "></td><td><input type="button" value=" } "></td><td><input type="button" value=" [ "></td><td><input type="button" value=" ] "></td><td><input id="capslock" name="button9" type="button" value="切换大/小写" style="width: 100px;"></td></tr><tr align="left" valign="middle"><td><input type="button" value=" a "></td><td><input type="button" value=" s "></td><td><input type="button" value=" d "></td><td><input type="button" value=" f "></td><td><input type="button" value=" g "></td><td><input type="button" value=" h "></td><td><input type="button" value=" j "></td><td><input name="button3" type="button" value=" k "></td><td><input name="button4" type="button" value=" l "></td><td><input name="button5" type="button" value=" : "></td><td><input name="button7" type="button" value=" &quot; "></td><td><input type="button" value=" ; "></td><td><input type="button" value=" \' "></td><td rowspan="2" colspan="2"><input id="accept" name="button12" type="button" value="确定" style="width: 127px;height: 42px;"></td></tr><tr align="left" valign="middle"><td><input name="button2" type="button" value=" z "></td><td><input type="button" value=" x "></td><td><input type="button" value=" c "></td><td><input type="button" value=" v "></td><td><input type="button" value=" b "></td><td><input type="button" value=" n "></td><td><input type="button" value=" m "></td><td><input type="button" value=" &lt; "></td><td><input type="button" value=" &gt; "></td><td><input type="button" value=" ? "></td><td><input type="button" value=" , "></td><td><input type="button" value=" . "></td><td><input type="button" value=" / "></td></tr></table></div>';
        var css = '#softkeyboard{border:1px solid #ddd;padding:1px;background:#fff;color:#35478C;}#softkeyboard .btn_letter, #softkeyboard .btn_num {padding: 1px; margin:1px;font-size: 14px; border: 1px solid #7FB2F0; cursor: pointer;color:#35478C;background-color:#E4EFF7;width:25px; height:20px;}#softkeyboard .btn_num {background-color:#fff;}';
        $("body").append(html + "<style>" + css + "</style>");
    }
    var password1 = [];
    exports.initPwd = function (pwd1) {
        password1.push(pwd1[0]);
    }
    var CapsLockValue = 0;
    exports.hidekeyboard = true;
    var addValue = function (newValue) {
        if (CapsLockValue == 0) {
            var str = namepwd.value
            if (str.length < password1[eli].maxLength) {
                namepwd.value += newValue;
            }
            if (str.length <= password1[eli].maxLength) {
                password1[eli].value = namepwd.value;
            }
        }
        else {
            var str = namepwd.value;
            if (str.length < password1[eli].maxLength) {
                //namepwd.value += newValue.toUpperCase();
                namepwdd.value += newValue;
            }
            if (str.length <= password1[eli].maxLength) {
                password1[eli].value = namepwd.value;
            }
        }
    }
    var setpassvalue = function () {
        var longnum = namepwd.value.length;
        var num
        num = namepwd.value.substr(0, longnum - 1);
        namepwd.value = num;
        var str = namepwd.value;
        password1[eli].value = namepwd.value;
    }
    exports.closekeyboard = function () {
        $(softkeyboard).hide();
        $(password1[eli]).removeClass('using').blur();
        exports.hidekeyboard = true;
    }
    exports.showkeyboard = function (i) {
        eli = i;
        namepwd.value = password1[eli].value;
        var th = password1[eli];
        var ttop = th.offsetTop;
        var thei = th.clientHeight;
        var tleft = th.offsetLeft;
        while (th = th.offsetParent) {
            ttop += th.offsetTop;
            tleft += th.offsetLeft;
        }
        $(softkeyboard).css({ 'top': ttop + thei + 16, 'left': tleft - 100 }).show();
        exports.hidekeyboard = false;
    }
    var setCapsLock = function () {
        if (CapsLockValue == 0) {
            CapsLockValue = 1
        }
        else {
            CapsLockValue = 0
        }
    }
    var setCalcButtonBg = function () {
        $('input', softkeyboard).each(function () {
            if (this.type == "button" && $(this).attr('bgtype') != "1") {
                if ($(this).attr('bgtype') == "2") {
                    this.className = "btn_num";
                } else {
                    this.className = "btn_letter";
                }
                var thisButtonValue = _trim(this.value);
                if (thisButtonValue.length == 1) {
                    this.onclick = function () {
                        addValue(thisButtonValue);
                    }
                }
            }
        });
    }
    var _trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    var capsLockFlag = true;
    var capsLockText = function () {
        if (capsLockFlag) {
            $('input', softkeyboard).each(function () {
                var char = this.value;
                var char = _trim(char);
                if (this.type == "button" && char >= "a" && char <= "z" && char.length == 1) {
                    this.value = " " + String.fromCharCode(char.charCodeAt(0) - 32) + " "
                }
            });
        }
        else {
            $('input', softkeyboard).each(function () {
                var char = this.value;
                var char = _trim(char);
                if (this.type == "button" && char >= "A" && char <= "Z" && char.length == 1) {
                    this.value = " " + String.fromCharCode(char.charCodeAt(0) + 32) + " "
                }
            });
        }
        capsLockFlag = !capsLockFlag;
    }
    var randomNumberButton = function () {
        var a = new Array(10);
        a[0] = 0;
        a[1] = 1;
        a[2] = 2;
        a[3] = 3;
        a[4] = 4;
        a[5] = 5;
        a[6] = 6;
        a[7] = 7;
        a[8] = 8;
        a[9] = 9;
        var randomNum;
        var times = 10;
        for (var i = 0; i < 10; i++) {
            randomNum = parseInt(Math.random() * 10);
            var tmp = a[0];
            a[0] = a[randomNum];
            a[randomNum] = tmp;
        }
        $('[name=button_number0]')[0].value = " " + a[0] + " ";
        $('[name=button_number1]')[0].value = " " + a[1] + " ";
        $('[name=button_number2]')[0].value = " " + a[2] + " ";
        $('[name=button_number3]')[0].value = " " + a[3] + " ";
        $('[name=button_number4]')[0].value = " " + a[4] + " ";
        $('[name=button_number5]')[0].value = " " + a[5] + " ";
        $('[name=button_number6]')[0].value = " " + a[6] + " ";
        $('[name=button_number7]')[0].value = " " + a[7] + " ";
        $('[name=button_number8]')[0].value = " " + a[8] + " ";
        $('[name=button_number9]')[0].value = " " + a[9] + " ";
    }
});