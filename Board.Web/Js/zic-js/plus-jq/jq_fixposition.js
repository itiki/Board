define(function (require, exports, module) {
    return function ($) {
        $.fn.fixposition = function (options) {
            var opts = $.extend({
                fixtop: 5,
                fixleft: 5
            }, options);

            this.each(function () {
                var o = $(this);
                var offset = o.offset();
                var topPosition = offset.top;
                var leftPosition = offset.left;
                topPosition -= opts.fixtop;
                leftPosition -= opts.fixleft;
                $("html:not(:animated),body:not(:animated)").animate({
                    scrollTop: topPosition,
                    scrollLeft: leftPosition
                }, 1100);
            });
        }
    }
});