define(function (require, exports, module) {
    return function ($, aspx) {

        $.fn.switchTab = function (options) {
            var opts = $.extend({
                hov: false,
                reflash: false
            }, options);

            this.each(function () {
                var par = $(this);
                if (par.data("init")) return true;
                var box = par.attr("box");
                $("li", par).removeClass("act");
                $("[id*='" + box + "-']").hide();

                if (opts.reflash) {
                    var urli = aspx.rrequest("tb" + box);
                    if (!urli) urli = 0;
                    var o = $("li", par).eq(urli);
                    o.addClass("act");
                    $("#" + box + "-" + urli).show();
                } else {
                    var cookiestr = aspx.url_segment(2) + "/" + aspx.url_segment(1) + "tb-" + box;
                    var cur = $.cookie(cookiestr);
                    if (!cur) cur = 0;
                    var o = $("li", par).eq(cur);
                    o.addClass("act");
                    $("#" + box + "-" + cur).show();
                }

                $("li", par).each(function (i) {
                    var o = $(this);
                    var turnfunc = function () {
                        $("li", par).removeClass("act");
                        $("[id*='" + box + "-']").hide();
                        o.addClass("act");
                        $("#" + box + "-" + i).show();
                        $.cookie(cookiestr, i);
                        if ($.fn.pngFix) par.pngFix();
                        $("body>div.parentFormaspnetForm").remove();
                    }
                    if (opts.reflash) {
                        o.bind('click', function () {
                            aspx.urlSetParmsValue("tb" + box, i);
                            if ($.fn.pngFix) par.pngFix();
                        });
                    } else {
                        o.bind('click', turnfunc);
                    }
                    if (opts.hov) {
                        o.bind("mouseover", turnfunc);
                    }
                });

                par.data("init", true);
            });

        }

    }
}); 