define(function (require, exports, module) {
    return function ($) {
        $.fn.zictext = function (options) {
            var opts = $.extend({
                hasval: "wval",
                hasbox: true,
                boxClass: "text_box",
                wvalClass: "wval_def"
            }, options);

            if ($.browser.safari) opts.hasbox = false;
            this.each(function () {
                var o = $(this);
                if (o.hasClass(opts.hasval)) o.data('hasval', true);

                if (o.data('hasval')) {
                    o.data("text", $.trim(o.attr("title")));
                    if ($.trim(o.val()) == "") {
                        o.val(o.data("text"));
                        o.addClass(opts.wvalClass);
                    } else if ($.trim(o.val()) == o.data("text")) {
                        o.addClass(opts.wvalClass);
                    }
                }

                o.focus(function () {
                    if (opts.hasbox) o.addClass(opts.boxClass);
                    if (o.data('hasval')) {
                        o.removeClass(opts.wvalClass);
                        if ($.trim(o.val()) == o.data("text")) o.val("");
                    }
                }).blur(function () {
                    if (opts.hasbox) o.removeClass(opts.boxClass);
                    if (o.data('hasval')) {
                        if ($.trim(o.val()) == "") {
                            o.val(o.data("text"));
                            o.addClass(opts.wvalClass);
                        } else if ($.trim(o.val()) == o.data("text")) {
                            o.addClass(opts.wvalClass);
                        }
                    }
                });
            });
        }
    }
});