define(function (require, exports, module) {
    require("jqplus/jq_area2Data");
    return function ($, _, mc) {

        $.fn.area2 = function (o) {
            var opts = $.extend({
                valueDom: "#ctl00_body_hfdata"
            }, o || {});
            var valueDom = $(opts.valueDom);

            //IE7中，Popup内部的A标签无法使用href属性，否则出现自动close的bug，原因未知。
            var areatemp = "<dl class='clear'><dt>{{key}}</dt><dd>\
                            {{#value}}<span class='prov' title='{{.}}'>{{.}}</span>{{/value}}\
                            </dd></dl>";
            var citytemp = "<ul class='cityhint popupbox clear'>\
                        {{#value}}<li><a title='{{.}}' class='city'>{{.}}</a></li>{{/value}}\
                        </ul>";
            //点击滚动条并不会触发click事件，而是触发失去焦点的事件，导致popup模块的联合反映
            //增加tabindex属性可以把点击行为委托到focus事件中。
            var datatemp = "<div class='datahint popupbox'><ul tabindex='1'>\
                        {{#value}}<li><a title='{{name}}' code='{{val}}'>{{name}}</a></li>{{/value}}\
                        </ul></div>";

            this.each(function () {
                var o = $(this);
                var dataBtn = $("<a class='area2Btn hide'>请选择</a>").insertAfter(o);

                var provhint = $('<div class="provhint popupbox"></div>').insertAfter(o);
                _.each(window.cityHintArea, function (v, k) {
                    provhint.append(mc.to_html(areatemp, { key: k, value: v }));
                });
                provhint.popup();

                $("span.prov", provhint).on("click", function () {
                    $("span.prov.current", provhint).next("ul.cityhint").popup("close");
                    var prov = $(this);
                    $("span.prov", provhint).removeClass("current");
                    prov.addClass("current");
                    if (prov.data("init")) return;

                    var cityhint = $(mc.to_html(citytemp, { value: window.cityHintProv[prov.text()] }));
                    prov.after(cityhint);
                    prov.data("init", true);
                    cityhint.popup().popup("open").on("click", "a", function () {
                        o.text(prov.text() + "-" + $(this).text());
                        cityhint.popup("close");
                        provhint.popup("close");
                        dataBtn.show().text("请选择").next(".datahint").remove();
                        valueDom.val("");
                        cacheData($(this).text(), data_init);
                        //ajaxData($(this).text(), data_init);
                    });
                });

                var data_init = function (datas) {
                    var strval = [];
                    _.each(datas, function (txt) {
                        txt = txt.split('-');
                        strval.push({ name: txt[0], val: txt[1] });
                    });
                    var datahint = $(mc.to_html(datatemp, { value: strval }));
                    dataBtn.after(datahint);
                    datahint.popup().on("click", "a", function (e) {
                        datahint.popup("close");
                        dataBtn.text($(this).text());
                        valueDom.val($(this).attr("code"));
                    });
                    var firsta = $("a:first", datahint);
                    dataBtn.text(firsta.text());
                    valueDom.val(firsta.attr("code"));
                }
            });
        };

    }
    var cacheData = function (city, callback) {
        var datas = window.cityHintCity[city];
        callback(datas);
    }
    var ajaxData = function (city, callback) {
        $.ajax({
            url: "/xxx.aspx/ajaxData",
            data: "{'city' : '" + city + "'}",
            success: function (m) {
                if (!m.d) return;
                callback(m.d);
            }
        });
    }
});