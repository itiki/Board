define(function (require, exports) {
    exports.url_segment = function (lastNum) {
        var url = location.href;
        url = url.split(".aspx")[0];
        url = url.split(".htm")[0];
        url = url.split("?")[0];
        var paraString = url.substring(0, url.length).split("/");
        if (paraString.length - 3 < lastNum)
            return "";
        var str = paraString[paraString.length - lastNum];
        if (!isNaN(parseInt(str))) str = 'number';
        return str.toLowerCase();
    }

    var isNaN = function (obj) {
        // `NaN` is the only value for which `===` is not reflexive.
        return obj !== obj;
    };

    //获取URL参数
    exports.rrequest = function (paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }

    //设置、修改URL参数
    exports.urlSetParmsValue = function (parms, parmsValue) {
        var query = location.search.substring(1); //获取查询串
        var pairs = query.split("&");
        var args = {};
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); //查找name=value     
            if (pos == -1) continue;
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            args[argname] = unescape(value);
        }        
        if (!args[parms]) {
            var urlstrings = document.URL;
            if (query) {
                urlstrings += ("&" + parms + "=" + parmsValue);
            }
            else {
                urlstrings += ("?" + parms + "=" + parmsValue);
            }
            window.location = urlstrings;
        }
        else {
            window.location = exports.updateParms(parms, parmsValue);  //修改参数
        }
    }

    //修改URL参数
    //parms：参数名，parmsValue：参数值，return：修改后的URL
    exports.updateParms = function (parms, parmsValue) {
        var newUrlParms = "";
        var newUrlBase = location.href.substring(0, location.href.indexOf("?") + 1); //截取查询字符串前面的url  
        var query = location.search.substring(1); //获取查询串     
        var pairs = query.split("&"); //在逗号处断开     
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); //查找name=value     
            if (pos == -1) continue; //如果没有找到就跳过     
            var argname = pairs[i].substring(0, pos); //提取name     
            var value = pairs[i].substring(pos + 1); //提取value   
            //如果找到了要修改的参数  
            if (argname.toLowerCase().indexOf(parms.toLowerCase()) != -1 ? true : false) {
                newUrlParms = newUrlParms + (argname + "=" + parmsValue + "&");
            }
            else {
                newUrlParms += (argname + "=" + value + "&");
            }
        }
        return newUrlBase + newUrlParms.substring(0, newUrlParms.length - 1);
    }
});