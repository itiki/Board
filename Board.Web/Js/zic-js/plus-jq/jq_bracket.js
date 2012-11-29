define(function (require, exports, module) {
    return function ($) {
        $.fn.bracket = function (options) {
            var opts = $.extend({
                space: 'vali'
            }, options);

            this.each(function () {
                var o = $(this);
                var re = eval("/" + opts.space + "\\[(.*)\\]/");
                res = re.exec(o.attr("class"));
                if (res)
                    o.data(opts.space, res[1].split(/\[|,|\]/));
            });
        }
    }
});