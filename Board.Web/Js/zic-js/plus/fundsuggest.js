define(function (require, exports) {
    var fundSuggest = function (sender, arg) {
        this.initialize(sender, arg);
    };
    fundSuggest.prototype = {
        $: function (o) { return typeof (o) == 'string' ? document.getElementById(o) : o; },
        $C: function (o) { return document.createElement(o); },
        $E: function (e) {
            tempObj = e.target ? e.target : event.srcElement;
            return tempObj;
        },
        $aE: function (elm, evType, fn, useCapture) {
            if (elm.addEventListener) {
                elm.addEventListener(evType, fn, useCapture);
                return true;
            } else if (elm.attachEvent) {
                var r = elm.attachEvent('on' + evType, fn);
                return r;
            } else {
                elm['on' + evType] = fn;
            }
        },
        $dE: function (elm, evType, fn, useCapture) {
            if (elm.removeEventListener) {
                elm.removeEventListener(evType, fn, useCapture);
                return true;
            } else if (elm.detachEvent) {
                var r = elm.detachEvent('on' + evType, fn);
                return r;
            } else {
                elm['on' + evType] = null;
                return;
            }
        },
        $aC: function (obj, name) {
            if (this.isNullorEmpty(this.$(obj).className)) {
                this.$(obj).className = name;
            } else {
                var cname = this.$(obj).className;
                var pattern = new RegExp("(\s*)" + name + "(\s*)", "ig");
                var reg = null;
                if (reg = cname.match(pattern)) {
                    return;
                } else {
                    this.$(obj).className = cname + " " + name;
                }
            }
        },
        $dC: function (obj, name) {
            if (this.isNullorEmpty(this.$(obj).className)) {
                return;
            } else {
                var cname = this.$(obj).className;
                var pattern = new RegExp("(\s*)" + name + "(\s*)", "ig");
                var reg = null;
                if (reg = cname.match(pattern)) {
                    this.$(obj).className = cname.replace(reg, "");
                } else {
                    return;
                }
            }
        },
        isNullorEmpty: function (obj) {
            if (obj == null || obj == "" || obj == "undefined") return true;
            else return false;
        },
        getPos: function (obj) {
            var curleft = 0;
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                }
                while (obj = obj.offsetParent)
            } else if (obj.x) {
                curleft += obj.x;
                curtop += obj.y;
            }
            return {
                'x': curleft,
                'y': curtop
            };
        },
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },

        initialize: function (sender, btn, arg) {
            this.input = this.$(sender);
            this.dpsel = btn;
            this.cbox = null;
            this.text = !(arg && arg.text) ? "请输入代码、拼音、简称" : arg.text;
            this.head = !(arg && arg.head) ? ["选项", "代码", "类型", "简称"] : arg.head;
            this.range = this.CharFilter() || ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            this.css = "fund_suggest_style";
            this.lis = null;
            this.divs = null;
            this.spans = [];
            this.result = null;
            this._F = null;
            this._iF = null;
            this._iN = null;
            this._iD = null;
            this._iC = null;
            this._iS = null;
            this._iT = null;
            this._iB = null;
            this._iBK = null;
            this._rows = 10;
            this._cols = 5;
            this._rowindex = -1;
            this._x = 0;
            this._y = 0;
            this._tabindex = 0;
            this.autoSubmit = true;
            this.switching = false;
            this._hidden = true;
            this.init();
        },
        init: function () {
            //this.input.value = this.text;
            this.input.setAttribute("autocomplete", "off");
            this.input.autoComplete = "off";
            this._iF = this._bd(this.inputFocus);
            this._iN = this._bd(this.Navigate);
            this._iD = this._bd(this.Confirm);
            this._iC = this._bd(this.Selected);
            this._iS = this._bd(this.DropList);
            this.$aE(this.input, "focus", this._iF);
            this.$aE(this.input, "blur", this._iF);
            this.$aE(this.input, "keyup", this._iN);
            this.$aE(this.input, "mouseup", this._iN);
            this.$aE(this.dpsel, "click", this._iS);
            if (!this.cbox) {
                this.CreateStyle();
                this.CreateBox();
                this.BindHtmlEvent();
                this.$aC(this.cbox, "hide");
            }
        },
        CharFilter: function () {
            var ischars = false;
            var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            if (glo_fundlist && glo_fundlist.length > 0) {
                for (var i = 0; i < chars.length; i++) {
                    for (var m = 0; m < glo_fundlist.length; m++) {
                        if (glo_fundlist[m][1].substr(0, 1).toUpperCase() == chars[i]) {
                            ischars = true;
                            break;
                        }
                    }
                    if (!ischars) {
                        chars.splice(i, 1);
                        i--;
                    }
                    ischars = false;
                }
            }
            return chars;
        },
        CreateBox: function () {
            this.cbox = this.$C("div");
            this.cbox.setAttribute("id", "em_fund_suggest");
            var objUl = this.$C("ul");
            var objli = this.$C("li");
            objli.m = 0;
            objli.innerHTML = "当前搜索";
            //objli.className = "at";
            var objdiv = this.$C("div");
            objdiv.id = "sgTab0";
            objdiv.innerHTML = "<h4>请在搜索框内输入'<label class=\"red\">代码</label>'、'<label class=\"red\">拼音</label>'或'<label class=\"red\">简称</label>'</h4>";
            objUl.appendChild(objli);
            this._tabindex = 0;
            this.cbox.appendChild(objUl);
            this.cbox.appendChild(objdiv);
            var $this = this;
            for (var i = 0; i < this.range.length; i++) {
                objli = this.$C("li");
                objli.m = i + 1;
                objli.innerHTML = this.range[i];
                objUl.appendChild(objli);
                objdiv = this.$C("div");
                objdiv.id = "sgTab" + (i + 1);
                var isExisted = false;
                var dlStr = "<dl>";
                var ddStr = "<dd>";
                var _rc = this._cols; _c = 0, _cx = 0, _cy = 0;
                for (var m = 0; m < glo_fundlist.length; m++) {
                    if (glo_fundlist[m][1].substr(0, 1).toUpperCase() == this.range[i]) {
                        isExisted = true;
                        _c++;
                        _cx = Math.ceil(_c / _rc);
                        _cy = (_c % _rc == 0) ? _rc : (_c % _rc);
                        ddStr += "<span tx=\"" + _cx + "\" ty=\"" + _cy + "\" title=\"" + glo_fundlist[m][2] + "(" + glo_fundlist[m][0] + ")\">" + glo_fundlist[m][2] + "</span>";
                    }
                }
                if (!isExisted) {
                    ddStr += "<span title=\"\" class=\"red\">无</span>";
                }
                ddStr += "</dd>";
                dlStr += ddStr + "</dl>";
                objdiv.innerHTML = dlStr;
                this.cbox.appendChild(objdiv);
            }
            var closebtn = this.$C("label");
            closebtn.innerHTML = "[×关闭]";
            closebtn.parent = this.cbox;
            closebtn.onclick = function () {
                $this.$aC(this.parent, "hide");
            }
            objUl.appendChild(closebtn);
            document.body.insertBefore(this.cbox, document.body.firstChild);
        },
        BindHtmlEvent: function () {
            this._iB = this._bd(this.BodyDown);
            this.$aE(document.body, "mousedown", this._iB);

            this.lis = this.cbox.getElementsByTagName("li");
            this.divs = this.cbox.getElementsByTagName("div");
            this.result = this.divs[0];
            this._iT = this._bd(this.SwitchTab);
            var $this = this;
            for (var i = 0; i < this.lis.length; i++) {
                this.lis[i].m = i;
                this.$aE(this.lis[i], "click", this._iT);
                this.spans[i] = this.divs[i].getElementsByTagName("span");
            }
            var _over = function (e) {
                var _this = $this.$E(e);
                var n = _this.n;
                $this._x = _this.getAttribute("tx"); $this._y = _this.getAttribute("ty");
                $this.input.value = _this.getAttribute("title").match(/[0-9]{6}/)[0];
                for (var m = 0; m < $this.spans[n].length; m++) {
                    if ($this.spans[n][m].getAttribute("tx") == $this._x.toString() && $this.spans[n][m].getAttribute("ty") == $this._y.toString()) {
                        $this.$aC($this.spans[n][m], "hover");
                    }
                    else {
                        $this.$dC($this.spans[n][m], "hover");
                    }
                }
            };
            var _out = function (e) {
                var _this = $this.$E(e); $this.$dC(_this, "hover"); this._x = 0; this._y = 0;
            };
            for (i = 0; i < this.spans.length; i++) {
                for (var j = 0; j < this.spans[i].length; j++) {
                    this.spans[i][j].n = i;
                    this.$aE(this.spans[i][j], "click", this._iC);
                    this.$aE(this.spans[i][j], "mouseover", _over);
                    this.$aE(this.spans[i][j], "mouseout", _out);
                }
            }
        },
        CreateStyle: function () {
            var left = this.getPos(this.input).x, top = this.getPos(this.input).y + this.input.clientHeight;
            if (!/msie/.test(window.navigator.userAgent.toLowerCase())) {
                left -= 8;
            }
            var styleStr = "#em_fund_suggest{left:" + left + "px; top:" + top + "px;}";
            var head = document.getElementsByTagName("head")[0];
            var old = document.getElementById(this.css);
            if (old) head.removeChild(old);
            var mystyle = document.createElement("style");
            mystyle.setAttribute("type", "text/css");
            head.appendChild(mystyle);
            mystyle.id = this.css;
            if (mystyle.styleSheet) {
                mystyle.styleSheet.cssText = styleStr;
            }
            else {
                var cssText = document.createTextNode(styleStr);
                mystyle.appendChild(cssText);
            }
            head.appendChild(mystyle);
        },
        BodyDown: function (e) {
            var o = this.$E(e);
            var container = this.cbox;
            if (o != this.dpsel) {
                if (o != this.input) {
                    while (o.parentNode) {
                        if (o == container) return;
                        if (o.tagName.toLowerCase() == "body") {
                            if (this.input.value == "" || this.input.value.replace(/(^\s*)|(\s*$)/g, "") == "") {
                                this.input.value = this.text;
                                this.$aC(this.input, "gray");
                            }
                            if (container.className.indexOf("hide") < 0) { this.$aC(this.cbox, "hide"); }
                            return;
                        }
                        o = o.parentNode;
                    };
                }
                else {
                    if (container.className.indexOf("hide") != -1) { this._tabindex = 0; this.$dC(this.cbox, "hide"); }
                }
            }
            else {
                if (container.className.indexOf("hide") > -1) {
                    this.$dC(this.cbox, "hide");
                    for (var i = 0; i < this.lis.length; i++) {
                        if (i == 1) { this.$aC(this.lis[i], "at"); this.$dC(this.divs[i], "hide"); }
                        else { this.$dC(this.lis[i], "at"); this.$aC(this.divs[i], "hide"); }
                    }
                }
                else {
                    if (this.lis[0].className.toLowerCase().indexOf("at") < 0) {
                        this.$aC(this.cbox, "hide");
                    }
                }
            }
        },
        SwitchTab: function (e) {
            this.StopBubble(e);
            var obj = this.$E(e);
            var m = obj.m;
            this._tabindex = m;
            this.input.focus();
            this._x = 0;
            this._y = 0;
            for (var i = 0; i < this.lis.length; i++) {
                if (i == m) {
                    this.$aC(this.lis[i], "at"); this.$dC(this.$(this.divs[i]), "hide");
                    if (this._tabindex == 0) { this.SetTip(); }
                    else {
                        for (var j = 0; j < this.spans[this._tabindex].length; j++) {
                            this.$dC(this.spans[this._tabindex][j], "hover");
                        }
                    }
                }
                else {
                    this.$dC(this.lis[i], "at"); this.$aC(this.$(this.divs[i]), "hide");
                }
            }
        },
        DropList: function () {
            if (!this.cbox) {
                this.CreateStyle();
                this.CreateBox();
                this.BindHtmlEvent();
            }
            this._tabindex = 1;
            this.input.focus();
            if (this.input.value == this.text) {
                this.input.value = "";
                this.$dC(this.input, "gray");
            }
            for (var i = 0; i < this.lis.length; i++) {
                if (i == 1) {
                    this.$aC(this.lis[i], "at"); this.$dC(this.divs[i], "hide");
                }
                else { this.$dC(this.lis[i], "at"); this.$aC(this.divs[i], "hide"); }
            }
        },
        inputFocus: function (e) {
            if (!this.cbox) {
                this.CreateStyle();
                this.CreateBox();
                this.BindHtmlEvent();
            }
            var $this = this;
            if (this._tabindex == 0) {
                for (var i = 0; i < this.lis.length; i++) {
                    if (i == 0) { this._tabindex = 0; this.$aC(this.lis[i], "at"); this.$dC(this.divs[i], "hide"); }
                    else { this.$dC(this.lis[i], "at"); this.$aC(this.divs[i], "hide"); }
                }

                var _t = e.type;
                var _tar = this.$E(e);
                if (this.input.value == this.text && _t.indexOf("focus") >= 0) {
                    this.input.value = "";
                    this.$dC(this.input, "gray");
                    this._hidden = false;
                    this.hideResults();
                }
                else if (this.input.value == "" && _t.indexOf("blur") >= 0) {

                }
                else { }
            }
        },
        Navigate: function (e) {
            if (!this.cbox || this.cbox.className.indexOf('hide') != -1) { return false; }
            else {
                //var left = this.getPos(this.input).x, top = this.getPos(this.input).y + this.input.clientHeight;
                //this.cbox.style.cssText = "left:" + left + "px; top:" + top + "px;";
            }
            switch (e.keyCode) {
                case 8:
                    if (this._tabindex != 0) {
                        for (var i = 0; i < this.lis.length; i++) {
                            if (i == 0) { this._tabindex = 0; this.$aC(this.lis[i], "at"); this.$dC(this.divs[i], "hide"); }
                            else { this.$dC(this.lis[i], "at"); this.$aC(this.divs[i], "hide"); }
                        }
                    }
                    this.Suggest();
                    break;
                case 37:
                    this._tabindex--;
                    this._x = 0;
                    this._y = 0;
                    var _len = this.lis.length;
                    if (this._tabindex >= 0) {
                        for (var i = 0; i < _len; i++) {
                            this.$dC(this.lis[i], "at");
                            this.$aC(this.divs[i], "hide");
                            if (this._tabindex == i) {
                                this.$aC(this.lis[i], "at");
                                this.$dC(this.divs[i], "hide");
                                if (this._tabindex == 0) { this.SetTip(); }
                                else {
                                    for (var j = 0; j < this.spans[this._tabindex].length; j++) {
                                        this.$dC(this.spans[this._tabindex][j], "hover");
                                    }
                                }
                            }
                        }
                    }
                    else {
                        this._tabindex = 0;
                    }
                    break;
                case 38:
                    if (this._tabindex == 0) {
                        if (this.result != null && this.result.innerHTML != "") {
                            if (this.result.firstChild.tBodies) {
                                var _tbody = this.result.firstChild.tBodies[0];
                                var _trows = _tbody.rows;
                                var _rows = _trows.length;
                                if (this._rowindex == -1) this._rowindex = _rows - 1;
                                else this._rowindex--;
                                if (this._rowindex < 0) { this._rowindex = _rows - 1; }
                                for (var i = 0; i < _rows; i++) {
                                    if (i == this._rowindex) {
                                        _trows[i]._over = true;
                                        this.input.value = _trows[i].tag;
                                        this.input.def = _trows[i].tag;
                                    }
                                    else {
                                        _trows[i]._over = false;
                                    }
                                    this.setColor(_trows[i]);
                                }
                            }
                        }
                    }
                    else {
                        var _len = this.spans[this._tabindex].length;
                        var _maxrowid = this.spans[this._tabindex][_len - 1].getAttribute("tx");
                        if (this._x == 0 && this._y == 0) {
                            this._x = _maxrowid;
                            this._y = this._cols;
                            if (!this.spans[this._x * this._y]) {
                                this._x--;
                            }
                        }
                        else {
                            this._x--;
                            if (this._x <= 0) {
                                this._x = _maxrowid;
                                this._y--;
                                if (this._y <= 0) { this._y = this._cols; }
                                var eleid = ((this._x - 1) * this._cols) + this._y;
                                if (!this.spans[this._tabindex][eleid - 1]) {
                                    this._x--;
                                }
                            }
                        }
                        for (var i = 0; i < _len; i++) {
                            if (this.spans[this._tabindex][i].getAttribute("tx") == this._x.toString() && this.spans[this._tabindex][i].getAttribute("ty") == this._y.toString()) {
                                this.input.value = (this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/) != null) ? this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/)[0] : "";
                                this.input.def = (this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/) != null) ? this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/)[0] : "";
                                this.$aC(this.spans[this._tabindex][i], "hover");
                            }
                            else {
                                this.$dC(this.spans[this._tabindex][i], "hover");
                            }
                        }
                    }
                    break;
                case 39:
                    var _len = this.lis.length;
                    this._tabindex++;
                    this._x = 0;
                    this._y = 0;
                    if (this._tabindex < _len) {
                        for (var i = 0; i < _len; i++) {
                            if (this._tabindex == i) {
                                this.$aC(this.lis[i], "at");
                                this.$dC(this.divs[i], "hide");
                                if (this._tabindex == 0) { this.SetTip(); }
                                else {
                                    for (var j = 0; j < this.spans[this._tabindex].length; j++) {
                                        this.$dC(this.spans[this._tabindex][j], "hover");
                                    }
                                }
                            }
                            else {
                                this.$dC(this.lis[i], "at");
                                this.$aC(this.divs[i], "hide");
                            }
                        }
                    }
                    else {
                        this._tabindex = _len - 1;
                    }
                    break;
                case 40:
                    if (this._tabindex == 0) {
                        if (this.result != null && this.result.innerHTML != "") {
                            if (this.result.firstChild.tBodies) {
                                var _tbody = this.result.firstChild.tBodies[0];
                                var _trows = _tbody.rows;
                                var _rows = _trows.length;
                                if (this._rowindex == -1) { this._rowindex = 0; }
                                else { this._rowindex++; }

                                if (this._rowindex > _rows - 1) { this._rowindex = 0; }
                                for (var i = 0; i < _rows; i++) {
                                    if (i == this._rowindex) {
                                        _trows[i]._over = true;
                                        this.input.value = _trows[i].tag;
                                        this.input.def = _trows[i].tag;
                                    }
                                    else {
                                        _trows[i]._over = false;
                                    }
                                    this.setColor(_trows[i]);
                                }
                            }
                        }
                    }
                    else {
                        var _len = this.spans[this._tabindex].length;
                        var _maxrowid = this.spans[this._tabindex][_len - 1].getAttribute("tx");
                        if (this._x == 0 && this._y == 0) {
                            this._x++; this._y++;
                        }
                        else {
                            this._x++;
                            if (this._x > parseInt(_maxrowid)) {
                                this._x = 1;
                                this._y++;
                                if (this._y > this._cols) { this._y = 1; }
                            } else {
                                var eleid = ((this._x - 1) * this._cols) + this._y;
                                if (!this.spans[this._tabindex][eleid - 1]) {
                                    this._x = 1;
                                    this._y++;
                                    if (this._y > this._cols) { this._y = 1; }
                                }
                            }
                        }
                        for (var i = 0; i < _len; i++) {
                            if (this.spans[this._tabindex][i].getAttribute("tx") == this._x.toString() && this.spans[this._tabindex][i].getAttribute("ty") == this._y.toString()) {
                                this.input.value = (this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/) != null) ? this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/)[0] : "";
                                this.input.def = (this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/) != null) ? this.spans[this._tabindex][i].getAttribute("title").match(/[0-9]{6}/)[0] : "";
                                this.$aC(this.spans[this._tabindex][i], "hover");
                            }
                            else {
                                this.$dC(this.spans[this._tabindex][i], "hover");
                            }
                        }
                    }
                    break;
                case 13:
                    this._hidden = true;
                    this.hideResults();
                    //if (this.autoSubmit) {
                    //    this.Submit();
                    //}
                    return false;
                    break;
                default:
                    this.Suggest();
                    break;
            }
        },
        Submit: function () {
            this.hideResults();
            var urlStr = "";
            urlStr = "http://fund.eastmoney.com/data/fundsearch.aspx?t=1&q=" + escape(this.input.def) + "&p=1";
            this.goUrl(urlStr, "_blank", false);
        },
        goUrl: function (url, target, iE) {
            window.open(url);
        },
        Selected: function (e) {
            var evt = this.$E(e);
            this.$aC(this.cbox, "hide");
            //window.open(evt.getAttribute("title").match(/[0-9]{6}/)[0] + '.html')
            //this.input.value = this.text;
            //this.$aC(this.input, "gray");
        },
        _bd: function (_b, _c) {
            var _d = this;
            return function () {
                var _e = null;
                if (typeof _c != "undefined") {
                    for (var i = 0; i < arguments.length; i++) {
                        _c.push(arguments[i]);
                    }
                    _e = _c;
                } else {
                    _e = arguments;
                }
                return _b.apply(_d, _e);
            }
        },
        StopBubble: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                window.event.cancelBubble = true;
            }
        },
        stopDefault: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            else {
                window.event.returnValue = false;
            }
            return false;
        },
        Suggest: function () {
            this._rowindex = -1;
            this.SetTip();
        },
        setColor: function (o) {
            var _Bg = "";
            if (o._over) {
                _Bg = "#A2D1FF";
            }
            else {
                _Bg = "#FFFFFF";
            }
            o.style.backgroundColor = _Bg;
        },
        mouseoverLine: function (o) {
            o._over = true;
            this._rowindex = o.index;
            this.setColor(o);
            this.input.value = o.tag;
            this.input.def = o.tag;
        },
        mouseoutLine: function (o) {
            o._over = false;
            this._rowindex = 0;
            this.setColor(o);
        },
        hideresume: function (o) {
            this._hidden = true;
            this.hideResults();
            //window.open('http://fund.eastmoney.com/' + o.tag + '.html')
            //this.input.value = this.text;
            //this.$aC(this.input, "gray");
        },
        hideResults: function () {
            if (this._hidden) {
                this.$aC(this.cbox, "hide");
            }
            else {
                this.$dC(this.cbox, "hide");
            }
        },
        setResults: function () {
            for (var i = 0; i < this.lis.length; i++) {
                if (i == 0) { this.$aC(this.lis[i], "at"); this.$dC(this.divs[i], "hide"); }
                else { this.$dC(this.lis[i], "at"); this.$aC(this.divs[i], "hide"); }
            }
        },
        SetTip: function () {
            var _s = this.trim(this.input.value);
            this.result.innerHTML = "";
            if (_s != "") {
                var t = this.$C("table");
                var tH = this.$C("thead");
                var tB = this.$C("tbody");
                //var tF = this.$C("tfoot");
                //var _t_f_tr = this.$C("tr");
                //var _t_f_td = this.$C("td");
                //_t_f_td.setAttribute("colspan", "4");
                //_t_f_td.colSpan = "4";
                //_t_f_td.innerHTML = "<a href=\"http://fund.eastmoney.com/data/fundsearch.aspx?t=1&q=" + escape(this.trim(_s)) + "&p=1\" target=\"_blank\" style='color:#c00;'>更多查询结果>></a>";
                //_t_f_tr.appendChild(_t_f_td);
                //tF.appendChild(_t_f_tr);
                //t.appendChild(tF);
                if (this.head != null) {
                    var _t_h_tr = this.$C("tr");
                    for (var i = 0; i < this.head.length; i++) {
                        var _t_th = this.$C("th");
                        if (this.head[i] == "选项") { _t_th.innerHTML = this.head[i]; }
                        if (this.head[i] == "代码") { _t_th.innerHTML = this.head[i]; }
                        if (this.head[i] == "类型") { _t_th.innerHTML = this.head[i]; }
                        if (this.head[i] == "简称") { _t_th.innerHTML = this.head[i] + "<label>(支持键盘↑↓←→)</label>" }
                        _t_h_tr.appendChild(_t_th);
                    }
                    tH.appendChild(_t_h_tr);
                    t.appendChild(tH);
                }

                var n = 0;
                for (var i = 0; i < glo_fundlist.length; i++) {
                    if (glo_fundlist[i][0].indexOf(_s) == 0 || glo_fundlist[i][1].toUpperCase().indexOf(_s.toUpperCase()) == 0 || glo_fundlist[i][2].toUpperCase().indexOf(_s.toUpperCase()) == 0) {
                        if (n < this._rows) {
                            var _t_tr = this.$C("tr");
                            _t_tr.id = "_tr_fg_" + n;
                            _t_tr.value = glo_fundlist[i][0];
                            _t_tr.tag = glo_fundlist[i][0];
                            _t_tr.style.cursor = "pointer";
                            _t_tr._oj = this;
                            _t_tr.index = n;
                            _t_tr.onmouseover = function () {
                                this._oj.mouseoverLine(this)
                            };
                            _t_tr.onmouseout = function () {
                                this._oj.mouseoutLine(this)
                            };
                            _t_tr.onclick = function () {
                                this._oj.hideresume(this)
                            };
                            for (var j = 0; j < this.head.length; j++) {
                                var _t_td = this.$C("td");
                                if (j == 0) {
                                    this.$aC(_t_td, "xs");
                                    if (/[0-9]+/.test(_s)) {
                                        _t_td.innerHTML = _t_td.innerHTML = "<label style='color:#c00;'>" + glo_fundlist[i][0].substr(0, _s.length) + "</label>" + glo_fundlist[i][0].substr(_s.length, 6);
                                    }
                                    if (/[a-zA-Z]+/.test(_s)) {
                                        _t_td.innerHTML = _t_td.innerHTML = "<label style='color:#c00;'>" + glo_fundlist[i][1].substr(0, _s.length) + "</label>" + glo_fundlist[i][1].substr(_s.length, 6);
                                    }
                                    if (/[\u4e00-\u9fa5]/.test(_s)) {
                                        _t_td.innerHTML = _t_td.innerHTML = "<label style='color:#c00;'>" + glo_fundlist[i][2].substr(0, _s.length) + "</label>" + glo_fundlist[i][2].substr(_s.length, 6);
                                    }
                                }
                                if (j == 1) { this.$aC(_t_td, "dm"); _t_td.innerHTML = glo_fundlist[i][0]; }
                                if (j == 2) { this.$aC(_t_td, "lx"); _t_td.innerHTML = glo_fundlist[i][3]; }
                                if (j == 3) { this.$aC(_t_td, "jc"); _t_td.innerHTML = glo_fundlist[i][2]; }
                                _t_tr.appendChild(_t_td);
                            }
                            tB.appendChild(_t_tr);
                            n++;
                        }
                        else { break; }
                    }
                }
                t.appendChild(tB);
                if (tB.rows.length > 0) {
                    this.result.appendChild(t);
                    this.input.def = tB.rows[0].tag;
                }
                else {
                    this.input.def = _s;
                    var dbnull = this.$C("h4");
                    dbnull.innerHTML = "很抱歉，找不到 \"<label style='color:#c00;'>" + _s + "</label>\"";
                    var dbnull2 = this.$C("h4");
                    dbnull2.innerHTML = "原因: 代码、拼音或简称输入有误!";
                    this.result.appendChild(dbnull);
                    this.result.appendChild(dbnull2);
                }
            }
            else {
                this.input.def = "";
                var dbnull = this.$C("h4");
                dbnull.innerHTML = "<h4>请在搜索框内输入'<label style='color:#c00;'>代码</label>'、'<label style='color:#c00;'>拼音</label>'或'<label style='color:#c00;'>简称</label>'</h4>";
                this.result.appendChild(dbnull);
            }
            this.setResults();
        }
    };
    return fundSuggest;

});