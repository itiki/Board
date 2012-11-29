define(function (require, exports) {
    exports.run = function (tit, rulesParsing) {
        var getRules = exports.Reg.exec(rulesParsing);
        if (!getRules) return;
        var str = getRules[1];
        var rules = str.split(/\[|,|\]/);
        var start = parseInt(rules[0]);
        var done = parseInt(rules[1]);
        var starlen = parseInt(rules[2]);

        var txt = tit.substring(0, start);
        if (starlen) {
            for (var i = 0; i < starlen; i++) {
                txt += "*";
            }
        } else {
            txt += "*****";
        }
        txt += tit.substring(tit.length - done, tit.length);
        return txt;
    }

    exports.Reg = /repstar\[(.*)\]/;
});

 