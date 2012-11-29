define(function (require, exports) {
    return function ($, JSON) {
        $.fn.serializeToArgs = function () {
            var json = this.serializeArray();
            var obj = {};
            for (var i = 0; i < json.length; i++) {
                obj[json[i].name] = json[i].value;
            }
            return JSON.stringify(obj);
        };
    }
});