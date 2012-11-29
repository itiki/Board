define(function (require, exports) {
    //var target = require('./jqplus/jq_target');
    //exports.ld_target = target.Loader;
    //exports.fix_target = target.fixui;
    //target.Init($, "#head ,#main, #foot");

    var $;
    var momos;
    exports.Init = function (jq, moms_arg) {
        $ = jq;
        moms = moms_arg;

        //<a tgtt="m_subnav" class="needz" href="#0">全部基金分类</a>
        //<ul id="m_subnav">...</ul>
        $.fn.fixtarget = function () {
            this.each(function () {
                var o = $(this);
                var tgtt = $("#" + o.attr("tgtt"));
                var mom = o.closest(moms);
                o.bind("click", function () {
                    o.toggleClass("tgt");
                    tgtt.toggle().toggleClass("tgt");
                    if (o.hasClass("needz")) mom.toggleClass("zmax");
                });
            });
        };

        //<div id="m0" tgtt_hov="m_subnav" class="needz">
        //  <a class="target" href="#0">全部基金分类</a>
        //  <ul id="m_subnav">...</ul>
        //</div>
        $.fn.fixtarget_hov = function () {
            this.each(function () {
                var o = $(this);
                var tgtt = $("#" + o.attr("tgtt"));
                var mom = o.closest(moms);
                var target = o.children(".target");
                o.hover(function (e) {
                    if (e.target == target[0]) {
                        o.addClass("tgt");
                        tgtt.show().addClass("tgt");
                        if (o.hasClass("needz")) mom.addClass("zmax");
                    }
                    e.stopPropagation();
                }, function () {
                    o.removeClass("tgt");
                    tgtt.hide().removeClass("tgt");
                    if (o.hasClass("needz")) mom.removeClass("zmax");
                });
            });
        };
    }

    exports.Loader = function () {
        $(moms).css("position", "relative");
        $("body").click(function (e) {
            if (!$(e.target).attr('tgtt')) {
                $('.tgtbox').each(function () {
                    if ($(this).is(":visible")) {
                        $(this).hide();
                        var tgt = $("[tgtt=" + $(this).attr("id") + "]");
                        tgt.removeClass('tgt');
                        $(this).closest(moms).removeClass('zmax');
                    }
                });
            }
        });
    }

    exports.fixui = function (box) {
        $('[tgtt_hov]').fixtarget_hov();
        $('[tgtt]').fixtarget();
    }

});