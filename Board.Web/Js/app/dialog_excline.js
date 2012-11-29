define(function (require, exports, module) {
    var $, sea, _, rdia;

    exports.Init = function (init) {
        $ = init.jq;
        rdia = $('#dia_exchline');
        sea = init;
        _ = init._;
        if (rdia.data("init")) return;
        $('a.donet', rdia).click(function () {
            var app = rdia.data('app');
            app.exchange($("input[name='line1']", rdia).val(), $("input[name='line2']", rdia).val());
            rdia.dialog("close");
        });
        rdia.data("form", $("div.form", rdia));
        rdia.data("init", true);
    }

    exports.Open = function (app) {
        rdia.data("app", app);
        rdia.data("form").empty();
        rdia.dialog("open");

        var p = $("<p></p>");
        p.append($("<input name='line1' type='text' class='text wval' title='行1编号' value='' />"));
        p.append($("<input name='line2' type='text' class='text wval' title='行2编号' value='' />"));
        rdia.data("form").append(p);

        sea.fix_mttext(rdia);
        return false;
    }

});