define(function (require, exports) {
    return function (m) {
        var json = m.d;
        var value = eval("(" + json + ")");
        return value;
    }
});

