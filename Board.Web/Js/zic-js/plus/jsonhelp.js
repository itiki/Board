define(function (require, exports) {
    exports.JsondatestrToObj = function (key, value) {
        var d;
        if (typeof value === 'string' && value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
            d = new Date(value.slice(5, -1));
            if (d) {
                return d;
            }
        }
        return value;
    }

    exports.TextdatestrToObj = function (key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }

});