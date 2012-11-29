define(function (require, exports, module) {
    var $ = require("jquery");
    var loc;

    exports.init = function () {
        loc = require("jqplus/jq_areaData");
        $.fn.jChinaArea = function (o) {
            o = $.extend({
                aspnet: false,
                txtOrCode: true,
                s1: null,
                s2: null,
                s3: null
            }, o || {});

            var wrap = $(this);
            var sel = $("select", wrap);
            var sProvince = sel.eq(0);
            var sCity = sel.eq(1);
            var sCounty = sel.eq(2);

            sProvince.empty();
            sCity.empty();
            sCounty.empty();
            exports.fillOption(sProvince, '0', o.s1, o.txtOrCode);
            exports.fillOption(sCity, '0,' + sProvince.val(), o.s2, o.txtOrCode);
            exports.fillOption(sCounty, '0,' + sProvince.val() + ',' + sCity.val(), o.s3, o.txtOrCode);

            if (o.aspnet) {
                var input = $("input", wrap);
                var tProvince = input.eq(0);
                var tCity = input.eq(1);
                var tCounty = input.eq(2);
                writeInput();
            }

            sProvince.change(function () {
                sCity.empty();
                exports.fillOption(sCity, '0,' + sProvince.val());
                sCounty.empty();
                exports.fillOption(sCounty, '0,' + sProvince.val() + ',' + sCity.val());
                if (o.aspnet) {
                    writeInput();
                }
            })
            sCity.change(function () {
                sCounty.empty();
                exports.fillOption(sCounty, '0,' + sProvince.val() + ',' + sCity.val());
                if (o.aspnet) {
                    writeInput();
                }
            })
            sCounty.change(function () {
                if (o.aspnet) {
                    writeInput();
                }
            })

            function writeInput() {
                if (o.txtOrCode) {
                    var sProvinceTxt = $(":selected", sProvince).text();
                    if (sProvinceTxt == "无") sProvinceTxt = "";
                    var tCityTxt = $(":selected", sCity).text();
                    if (tCityTxt == "无") tCityTxt = "";
                    var tCountyTxt = $(":selected", sCounty).text();
                    if (tCountyTxt == "无") tCountyTxt = "";
                    tProvince.val(sProvinceTxt);
                    tCity.val(tCityTxt);
                    tCounty.val(tCountyTxt);
                } else {
                    tProvince.val($(":selected", sProvince).val());
                    tCity.val($(":selected", sCity).val());
                    tCounty.val($(":selected", sCounty).val());
                }
            }
        };
    }

    exports.find = function (id) {
        if (typeof (loc[id]) == "undefined") return false;
        return loc[id];
    }

    exports.fillOption = function (el, loc_id, selectedArg, vOt) {
        var json = exports.find(loc_id);
        if (json) {
            var index = 1;
            var selected_index = 0;
            el.append('<option value="">无</option>');
            $.each(json, function (k, v) {
                var option = '<option value="' + k + '">' + v + '</option>';
                el.append(option);
                if ((vOt && v == selectedArg) || (!vOt && k == selectedArg)) {
                    selected_index = index;
                }
                index++;
            });
            el.get(0).selectedIndex = selected_index;
        }
    }
});