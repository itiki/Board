define(function (require, exports) {
    exports.run = function (arr) {
        document.oncontextmenu = function () {
            event.returnValue = false
        }
    }
});