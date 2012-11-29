define(function (require, exports, module) {
    return function ($) {
        require('./jq_timers')($);
        $.fn.countdown = function (options) {
            var opts = $.extend({
                btnDom: '.timebtn',
                spanDom: '.leave',
                turntextAttr: 'turntext',
                unactionClass: 'gray_im'
            }, options);

            this.each(function () {
                var o = $(this),
                    timebtn = $(opts.btnDom, o),
                    leave = $(opts.spanDom, o),
                    secound = leave.text(),
                    turntext = o.attr(opts.turntextAttr);

                timebtn.data({
                    "countdown": true
                }).click(function () {
                    if ($(this).data('countdown')) return false;
                });
                timebtn.everyTime(1000, turntext, function (i) {
                    var time = secound - i;
                    leave.text(time);
                    if (time === 0) {
                        timebtn.stopTime(turntext);
                        timebtn.data({
                            "countdown": false
                        });
                        timebtn.text(turntext);
                        timebtn.removeClass(opts.unactionClass);
                    }
                });

            });
        }
    }
});