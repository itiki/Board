define(function (require, exports) {
    exports.run = function (tit, rulesParsing, char) {
        var getRules = exports.Reg.exec(rulesParsing);
        if (!getRules) return;
        var str = getRules[1];
        var rules = str.split(/\[|,|\]/);
        var start = parseInt(rules[0]);
        var done = parseInt(rules[1]);

        var txt = tit.substring(0, start);
        for (var i = start; i <= done; i++) {
            txt += char;
        }
        txt += tit.substring(done + 1, tit.lenght);
        return txt;
    }

    exports.Reg = /repchar\[(.*)\]/;
});

 