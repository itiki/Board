define(function (require, exports, module) {
    var Backbone = require('backbone');
    var dialog = require('./dialog');

    var $, sea, _, mc, templist;

    exports.Init = function (init) {
        sea = init;
        _ = sea._;
        $ = init.jq;
        mc = init.mc;
        dialog.Init(init);
        templist = new TempList;
    }

    var TempModel = Backbone.Model.extend({
        defaults: {
            size: 300,
            font: 14,
            multi: false,
            align: 'left',
            ico: ''
        },
        initialize: function (attrs) {
            this.bind("change:font", function () {
                if (this.get("font") > 16)
                    sea.shownotifi('字体过大，请谨慎处理……', 'attention', 'changefont' + this.get('id'));
                else
                    sea.clearnotifi('changefont' + this.get('id'));
            });
        },
        validate: function (attrs) {
            var ok = true;
            if (attrs.id && !_.isNumber(attrs.id)) ok = false;
            if (attrs.size && !_.isNumber(attrs.size)) ok = false;
            if (attrs.multi && !_.isBoolean(attrs.multi)) ok = false;
            if (ok) {
                sea.clearnotifi('tempitem_error');
            } else {
                sea.shownotifi('字段验证错误！请联系管理员', 'error', 'tempitem_error');
            }
        }
    });

    var TempView = Backbone.View.extend({
        tagName: 'p',
        className: 'temple',
        events: {
            "click a.del": "remove",
            "keyup input.text": "changeSize",
            "keypress input.text": "vailSizeInput",
            "change select.sel_setopt": "changeFont",
            "change select.sel_aliopt": "changeAlign",
            "change select.sel_ico": "changeIco"
        },
        initialize: function (spec) {
            _.bindAll(this, 'render', 'remove');
        },
        mc_temp: "<span class='lineidsp'>行编号：{{id}}</span>\
            <label>宽度</label>\
            <input type='text' name='size' value='{{size}}' class='text wval w100' title='单位为像素px' />\
            <label class='ml10'>字体大小</label>\
            <select class='sel_setopt'></select>\
            <label class='ml10'>对齐</label>\
            <select class='sel_aliopt'>\
                <option value='left'>Left</option>\
                <option value='center'>Center</option>\
                <option value='right'>Right</option>\
            </select>\
            <label class='ml10'>图标</label>\
            <select class='sel_ico'></select>\
            <a class='del'></a>",
        tempHsel: { H1: 'h1', H2: 'h2', H3: 'h3' },
        tempTsel: { F12: '12', F14: '14', F16: '16', F18: '18', F20: '20', F22: '22', F24: '24' },
        render: function () {
            $(this.el).html(mc.to_html(this.mc_temp, this.model.toJSON()));
            var select = $('select.sel_setopt', this.el);
            if (_.isNumber(this.model.get('font'))) {
                for (var i in this.tempTsel) {
                    select.append("<option value='" + this.tempTsel[i] + "'>" + i + "</option>");
                }
            } else {
                for (var i in this.tempHsel) {
                    select.append("<option value='" + this.tempHsel[i] + "'>" + i + "</option>");
                }
            }
            select.setSelectedValue(this.model.get('font'));
            var ali_select = $('select.sel_aliopt', this.el);
            ali_select.setSelectedValue(this.model.get('align'));

            var ico_select = $('select.sel_ico', this.el);
            var ico_props = _.filter(glo_selprops, function (item) {
                return item.PropType == 1;
            });
            ico_props.push({ Name: '正常', ClassName: '' });
            for (var i = 0; i < ico_props.length; i++) {
                var opt = $("<option value='" + ico_props[i].ClassName + "'>" + ico_props[i].Name + "</option>");
                if (this.model.get('ico') == ico_props[i].ClassName)
                    opt.attr('selected', 'selected');
                opt.appendTo(ico_select);
            }

            sea.fix_mttext(this.el_c);
            return this;
        },
        changeSize: function (e) {
            var val = $('input.text', this.el).val();
            if (!_.isNaN(parseInt(val))) {
                this.model.set({ 'size': parseInt(val) });
            }
        },
        vailSizeInput: function (e) {
            var keychar = String.fromCharCode(e.which);
            if (_.isNaN(parseInt(keychar))) {
                sea.shownotifi('请输入数字！', 'error');
                return false;
            }
            sea.clearnotifi();
        },
        changeFont: function () {
            var font = $('select.sel_setopt', this.el).val();
            if (_.isNaN(parseInt(font)))
                this.model.set({ 'font': font });
            else
                this.model.set({ 'font': parseInt(font) });
        },
        changeAlign: function () {
            var align = $('select.sel_aliopt', this.el).val();
            this.model.set({ 'align': align });
        },
        changeIco: function () {
            var ico = $('select.sel_ico', this.el).val();
            this.model.set({ 'ico': ico });
        },
        remove: function () {
            //if (!confirm("确定要删除?")) return;
            $(this.el).fadeOut();
            templist.remove(this.model);
            sea.shownotifi('对象已被删除！', 'success');
        }
    });

    var TempList = Backbone.Collection.extend({
        model: TempModel,
        initialize: function () {
            _.bindAll(this, 'toTempJson', 'fromTempJson');
            this.bind('add', this.addOne);
        },
        addOne: function (m) {
            var view = new TempView({ model: m, list: this });
            this.el.append(view.render().el);
        },
        toTempJson: function () {
            var tempjson = [];
            this.each(function (item) {
                if (_.isNumber(item.get('font'))) {
                    if (_.isArray(_.last(tempjson))) {
                        _.last(tempjson).push(item.toJSON());
                    } else {
                        tempjson.push([item.toJSON()]);
                    }
                } else {
                    tempjson.push(item.toJSON());
                }
            });
            return tempjson;
        },
        fromTempJson: function (tempjson) {
            for (var i = 0; i < tempjson.length; i++) {
                if (_.isArray(tempjson[i])) {
                    for (var x = 0; x < tempjson[i].length; x++) {
                        this.add(tempjson[i][x]);
                    }
                } else {
                    this.add(tempjson[i]);
                }
            }
        }
    });

    exports.TempAppView = Backbone.View.extend({
        tempids: 0,
        initialize: function (spec) {
            templist.el = spec.el;
            _.bindAll(this, 'render', 'AddT', 'AddH', 'SubmitCreat', 'SubmitEdit', 'InjectSeatData');
            spec.btnAddT.bind('click', this.AddT);
            spec.btnAddH.bind('click', this.AddH);
            this.txtName = spec.txtName;
            this.folderSel = spec.folderSel;

            if (spec.seatid) {
                spec.formSubmit.bind('submit', this.SubmitEdit);
                this.seatid = spec.seatid;
                var obj = sea.JSON.parse(spec.editJson);
                templist.fromTempJson(obj);
                this.tempids = templist.last().get('id');
            } else {
                spec.formSubmit.bind('submit', this.SubmitCreat);
                for (var i = 0; i < spec.defline; i++) {
                    templist.add({ id: ++this.tempids });
                }
            }
        },
        AddT: function () {
            templist.add({ id: ++this.tempids });
            return false;
        },
        AddH: function () {
            templist.add({ id: ++this.tempids, font: 'h1' });
            return false;
        },
        SubmitCreat: function () {
            $.ajax({ url: "/Seat/Creat", o: this,
                data: { name: this.txtName.val(),
                    parentId: parseInt(this.folderSel.val()),
                    tempjson: sea.JSON.stringify(templist.toTempJson()),
                    definejson: sea.JSON.stringify(this.InjectSeatData())
                },
                success: function (m) {
                    if (!sea.checkreturn(m)) return;
                    this.o.txtName.val('');
                    sea.shownotifi('添加成功！', 'success');
                }
            });
            return false;
        },
        SubmitEdit: function () {
            $.ajax({ url: "/Seat/Index",
                data: { seatid: this.seatid,
                    name: this.txtName.val(),
                    parentId: parseInt(this.folderSel.val()),
                    tempjson: sea.JSON.stringify(templist.toTempJson()),
                    definejson: sea.JSON.stringify(this.InjectSeatData())
                },
                success: function (m) {
                    if (!sea.checkreturn(m)) return;
                    sea.shownotifi('更新成功！', 'success');
                }
            });
            return false;
        },
        InjectSeatData: function () {
            var definedata = {};
            for (var i = 0; i < templist.length; i++) {
                var id = templist.at(i).get('id');
                definedata[id] = [];
                definedata[id].push({
                    tempid: 1,
                    text: '新建的元素',
                    href: '#9',
                    color: '',
                    fsize: '',
                    feature: '',
                    ico: '',
                    backcolor: '',
                    title: '新建的元素'
                });
            }
            return definedata;
        }
    });

});