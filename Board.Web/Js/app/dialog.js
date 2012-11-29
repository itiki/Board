define(function (require, exports, module) {
    var $, sea, _, rdia;

    exports.Init = function (init) {
        $ = init.jq;
        rdia = $('#dia_ret');
        sea = init;
        _ = init._;
        if (rdia.data("init")) return;
        $('a.donet', rdia).click(function () {
            var item = rdia.data('itemview');
            var data = $("select, input:text", rdia).serializeToArgs();
            item.change(sea.JSON.parse(data));
            rdia.dialog("close");
        });
        rdia.data("form", $("div.form", rdia));
        rdia.data("init", true);
    }

    exports.Prop = function (item, auths) {
        rdia.data("form").empty();
        rdia.data("itemview", item);
        rdia.dialog("open");
        for (var dd in item.tempProps) {
            var tempid = item.tempProps[dd].id;
            var hasauth = _.any(auths, function (auth) { return auth.Key2 == tempid });
            if (!hasauth) continue;

            var input;
            if (tempid < 10) {
                input = $("<select name='" + dd + "'></select>");
                var props = exports.SelpropsGet(tempid);
                props.push({ Name: '正常', ClassName: '' });
                for (var i = 0; i < props.length; i++) {
                    var opt = $("<option value='" + props[i].ClassName + "'>" + props[i].Name + "</option>");
                    if (item.model.get(dd) == props[i].ClassName)
                        opt.attr('selected', 'selected');
                    opt.appendTo(input);
                }
            } else {
                input = $("<input name='" + dd + "' type='text' class='text' value='" + item.model.get(dd) + "' />");
                if (input.attr('name') == 'href') input.addClass('selall');
            }

            var p = $("<p></p>");
            p.append("<label>" + item.tempProps[dd].name + "</label>");
            p.append(input);
            rdia.data("form").append(p);
        }
        sea.fix_mttext(this.el_c);
        return false;
    }

    exports.SelpropsGet = function (selid) {
        return _.filter(glo_selprops, function (item) {
            return item.PropType == selid;
        });
    }

});