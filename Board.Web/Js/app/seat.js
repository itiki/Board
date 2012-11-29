define(function (require, exports, module) {
    var Backbone = require('backbone');
    var dialog = require('./dialog');
    var dialog_excline = require('./dialog_excline');
    var $, sea, _, mc;
    exports.Init = function (init) {
        $ = init.jq;
        sea = init;
        _ = init._;
        mc = init.mc;
        dialog.Init(init);
        dialog_excline.Init(init);
    }

    var load = {};
    exports.Loader = function (spec) {
        load = _.defaults(spec, load);
        UserStore.initialize(load);
    }

    exports.InitApp = function (spec) {
        load = _.defaults(spec, load);
        SeatApp.initialize(load);
    }

    var UserStore = {
        list: [],
        lineid: "userstore",
        initialize: function (spec) {
            this.list = [];
            this.el = spec.userst_dom;
            this.el.attr('line', this.lineid);
            var opts = { lineId: this.lineid };
            this.list = new ItemList(opts);
            if (spec.json) this.defineJson = sea.JSON.parse(spec.json);
            this.renderUserStore();
        },
        renderUserStore: function () {
            this.el.empty();
            var so = this.list;
            _.each(this.defineJson, function (item) {
                so.addWithView(item);
            });
            this.el.append(this.list.sortul);
            this.list.validate();
        },
        IsUserstoreLine: function (lineId) {
            return lineId == this.lineid;
        }
    }

    var SeatApp = {
        lists: [],
        initialize: function (spec) {
            this.el = spec.el;
            this.id = spec.mod.Id;
            this.sub = spec.sub;
            this.auths = spec.propauth;
            _.bindAll(this, 'submit', 'exchange');
            this.sub.unbind('click').click(this.submit);

            this.el_c = spec.el_classic;
            _.bindAll(this, 'submit_c', 'turn_c');
            this.turnbtn = spec.turnbtn;
            this.turnbtn.unbind('click').click(this.turn_c);
            spec.sub_classic.unbind('click').click(this.submit_c);
            this.fluentbox = spec.fluent;
            this.classicbox = spec.classic;
            this.turnbtn.data('fluent', this.fluentbox.is(':visible'));

            var so = this;
            spec.exchange.unbind('click').click(function () { dialog_excline.Open(so) });

            if (spec.mod.TempJson) {
                this.tempjson = sea.JSON.parse(spec.mod.TempJson);
                this.InjectTemp();
            } else {
                $(this.el).html(spec.mod.TempHtml);
            }
            this.defjson = sea.JSON.parse(spec.mod.DefineJson);
            this.render();
            this.render_c();
        },
        InjectTemp: function () {
            this.el.empty();
            var so = this, maxwith = 200;
            _.each(this.tempjson, function (item) {
                if (_.isArray(item)) {
                    var html = $("<ul>");
                    for (var x = 0; x < item.length; x++) {
                        var li = $("<li>", {
                            "class": item[x].align + " " + item[x].ico + " f" + item[x].font + " bod_b",
                            line: item[x].id,
                            size: item[x].size,
                            multi: item[x].multi == "true" ? "true" : "",
                            style: "width:" + item[x].size + "px"
                        });
                        if (item[x].size > maxwith) maxwith = item[x].size;
                        $("<span>", { 'class': 'surplus' }).appendTo(li);
                        $("<span>", { 'class': 'lineUp' }).bind('click', { so: so, type: 'up' }, so.linemove).appendTo(li);
                        $("<span>", { 'class': 'lineDown' }).bind('click', { so: so, type: 'down' }, so.linemove).appendTo(li);
                        $("<span>", { 'class': 'lid' }).text(item[x].id).appendTo(li);
                        html.append(li);
                    }
                    so.el.append(html);
                } else {
                    var hh = $("<" + item.font + ">", {
                        "class": item.align + " " + item.ico + " bod_b",
                        line: item.id,
                        size: item.size,
                        font: item.font,
                        style: "width:" + item.size + "px"
                    });
                    $("<span>", { 'class': 'surplus', style: 'left:500px' }).appendTo(hh);
                    $("<span>", { 'class': 'lineUp' }).bind('click', { so: so, type: 'up' }, so.linemove).appendTo(hh);
                    $("<span>", { 'class': 'lineDown' }).bind('click', { so: so, type: 'down' }, so.linemove).appendTo(hh);
                    $("<span>", { 'class': 'lid' }).text(item.id).appendTo(hh);
                    so.el.append(hh);
                }
            });
            $('span.surplus', this.el).attr({ 'style': 'left:' + (maxwith + 40) + 'px' });
            $('span.lineDown', this.el).last().remove();
            $('span.lineUp', this.el).first().remove();
        },
        render_c: function () {
            this.el_c.empty();
            var so = this;
            _.each(this.lists, function (list) {
                var ul = $("<ul>", { lid: list.id });
                _.each(list.models, function (mod) {
                    var li = $("<li>");
                    li.addClass("fn-inbk");
                    $("<input>", { type: 'text', name: 'text', 'class': 'text wval mr10_imp', value: mod.attributes.text, title: '编辑文字' }).appendTo(li);
                    $("<input>", { type: 'text', name: 'href', 'class': 'text wval selall', value: mod.attributes.href, title: '编辑链接' }).appendTo(li);
                    ul.append(li);
                });
                ul.append("<span class='lid'>" + list.id + "</span>");
                so.el_c.append(ul);
            });
            sea.fix_mttext(this.el_c);
        },
        render: function () {
            this.lists = [];
            $('[line]>ul.sortul', this.el).remove();
            for (var d in this.defjson) {
                var opts = { lineId: d };
                var l = $('[line="' + d + '"]', this.el);
                if (l.attr('size')) opts.size = parseInt(l.attr('size'));
                if (l.attr('multi')) opts.multi = Boolean(l.attr('multi'));

                var newline = new ItemList(opts);
                for (var i = 0; i < this.defjson[d].length; i++) {
                    newline.addWithView(this.defjson[d][i]);
                }
                l.append(newline.sortul);
                this.lists.push(newline);
            }
            this.validate();
            this.sortable();
            //sea.fix_mttext(this.el_c);
        },
        validate: function () {
            this.vali_ok = true;
            var so = this;
            _.each(this.lists, function (list) {
                list.validate();
                list.sortul.siblings('span.surplus').text(list.surplus_char);
                if (!list.approve) { so.vali_ok = false; return false; }
            });
            if (this.vali_ok) {
                this.sub.unbind('click').bind('click', this.submit).button({ disabled: false });
                sea.clearnotifi('seat_vail');
            } else {
                this.sub.unbind('click').button({ disabled: true });
                sea.shownotifi('有文字超出容器范围！', 'error', 'seat_vail');
            }
        },
        sortable: function () {
            var so = this;
            $("#itemtemplist>li").draggable({
                connectToSortable: "ul.sortul",
                helper: "clone",
                stop: function (event, ui) {
                    var newli = $('li.newitem', so.el);
                    if (!newli.length) {
                        newli = $('li.newitem', UserStore.el);
                        if (!newli.length) return;
                    }
                    var newdefine = {};
                    newdefine.tempid = ui.helper.attr('itempid');
                    var tempProps = sea.JSON.parse(itemtempget(newdefine.tempid).Props);
                    for (var dd in tempProps) {
                        newdefine[dd] = tempProps[dd].def;
                    }
                    var lineId = newli.closest('[line]').attr('line');
                    var index = newli.prevAll().length;

                    so.item_add(newdefine, lineId, index);
                    //sea.fix_mttext(this.el_c);
                }
            });
            $("ul.sortul").sortable({
                //containment: so.el,
                connectWith: "ul.sortul",
                start: function (event, ui) {
                    if (ui.item.hasClass('newitem')) return;
                    this.o_listId = ui.item.closest('[line]').attr('line');
                    var ul = ui.item.closest('ul');
                    var li = ui.item.closest('li');
                    this.o_index = $('li', ul).index(li);
                },
                stop: function (event, ui) {
                    if (ui.item.hasClass('newitem')) return;
                    this.listId = ui.item.closest('[line]').attr('line');
                    var ul = ui.item.closest('ul');
                    var li = ui.item.closest('li');
                    this.index = $('li', ul).index(li);

                    so.item_move(this.o_listId, this.o_index, this.listId, this.index);
                    so.validate();
                }
            }).disableSelection();
        },
        linemove: function (spec) {
            var uplineid = $(this).parent("[line]").attr('line');
            var so = spec.data.so;
            so.InjectDefJson();

            var targetstr = '';
            var isdown = false;
            for (var def in so.defjson) {
                if (isdown) {
                    targetstr = def;
                    break;
                }
                if (def == uplineid) {
                    if (spec.data.type == "up")
                        break;
                    else
                        isdown = true;
                } else {
                    targetstr = def;
                }
            }

            var movedef = so.defjson[uplineid];
            so.defjson[uplineid] = so.defjson[targetstr];
            so.defjson[targetstr] = movedef;

            so.render();
        },
        item_move: function (o_listId, o_index, listId, index) {
            var o_list, list;
            if (UserStore.IsUserstoreLine(o_listId)) {
                o_list = UserStore.list;
            } else {
                o_list = _.find(this.lists, function (item) {
                    return item.id == o_listId;
                });
            }
            if (UserStore.IsUserstoreLine(listId)) {
                list = UserStore.list;
            } else {
                list = _.find(this.lists, function (item) {
                    return item.id == listId;
                });
            }

            var o = o_list.at(o_index);
            o_list.remove(o, { silent: true });
            list.add(o, { at: index });

            this.validate();
        },
        item_add: function (define, listId, index) {
            if (UserStore.IsUserstoreLine(listId)) {
                UserStore.list.addWithViewByIndex(define, index);
                UserStore.list.validate();
                return;
            }
            _.each(this.lists, function (list) {
                if (list.id == listId) {
                    list.addWithViewByIndex(define, index);
                    return false;
                }
            });
            this.validate();
        },
        item_del: function (listId, index) {
            if (UserStore.IsUserstoreLine(listId)) {
                UserStore.list.remove(UserStore.list.at(index));
                UserStore.list.validate();
                return;
            }
            _.each(this.lists, function (list) {
                if (list.id == listId) {
                    list.remove(list.at(index)); return;
                }
            });
            this.validate();
        },
        exchange: function (line1, line2) {
            this.InjectDefJson();
            var movedef = this.defjson[line1];
            this.defjson[line1] = this.defjson[line2];
            this.defjson[line2] = movedef;
            this.render();
        },
        turn_c: function () {
            if (!this.vali_ok) {
                alert('请通过验证后切换');
                return;
            }
            if (this.turnbtn.data('fluent')) {
                this.render_c();
                this.fluentbox.hide();
                this.classicbox.show();
                this.turnbtn.data('fluent', false);
            } else {
                this.injectfromclassic();
                this.InjectDefJson();
                this.render();
                this.fluentbox.show();
                this.classicbox.hide();
                this.turnbtn.data('fluent', true);
            }
        },
        injectfromclassic: function () {
            var so = this;
            this.el_c.children('ul').each(function () {
                var lid = $(this).attr('lid');
                var list = _.find(so.lists, function (item) {
                    return item.id == lid;
                });
                $('li', this).each(function (i) {
                    list.at(i).attributes.text = $("input[name='text']", this).val();
                    list.at(i).attributes.href = $("input[name='href']", this).val();
                });
            });
        },
        submit_c: function () {
            this.injectfromclassic();
            this.submit();
        },
        submit: function () {
            this.sub.btbutton('loading');
            this.InjectDefJson();
            this.InjectUseStorDefJson();
            var so = this;
            $.ajax({ url: "/Seat/UseUpdate",
                data: { seatId: this.id,
                    definejson: sea.JSON.stringify(this.defjson),
                    cache: this.Getcache(),
                    userstore: sea.JSON.stringify(UserStore.defineJson)
                },
                success: function (m) {
                    so.sub.btbutton('reset');
                    if (!sea.checkreturn(m)) return;
                    sea.shownotifi('更新成功！', 'success');
                }
            });
        },
        InjectDefJson: function () {
            var def = {};
            _.each(this.lists, function (list) {
                var itemlist = [];
                _.each(list.models, function (mod) {
                    itemlist.push(mod.attributes);
                });
                def[list.id] = itemlist;
            });
            this.defjson = def;
        },
        InjectUseStorDefJson: function () {
            UserStore.defineJson = [];
            _.each(UserStore.list.models, function (mod) {
                UserStore.defineJson.push(mod.attributes);
            });
        },
        Getcache: function () {
            var tempel = this.el.clone();
            $('[line]', tempel).each(function () {
                var items = $(this).find("a, img").clone();
                $(this).empty().append(items);
                $(this).removeAttr("line").removeAttr("size").removeAttr("font").removeAttr("multi").removeClass('bod_b');
            });
            return tempel.html();
        }
    };

    var ItemList = Backbone.Collection.extend({
        model: ItemModel,
        opts: { font: 12, size: 300, multi: false },
        initialize: function (spec) {
            this.remove(this.at(0));
            _.defaults(spec, this.opts);
            _.bindAll(this, 'validate', 'addWithView', 'addWithViewByIndex');
            this.id = spec.lineId;
            this.sortul = $("<ul class='sortul'></ul>");
            if (!spec.multi) this.sortul.css('white-space', 'nowrap');
            if (spec.size) this.size = spec.size;
        },
        validate: function () {
            this.approve = true;
            if (!this.size) return;
            var tolwidth = 0;
            var lis = this.sortul.children('li');
            for (var i = 0; i < lis.length; i++) {
                tolwidth += lis.eq(i).width();
            }
            if (tolwidth > this.size)
                this.approve = false;
            this.surplus = this.size - tolwidth;
            this.surplus_char = Math.floor(this.surplus / 16);

            if (this.sortul.text() == "")
                this.sortul.addClass('keeparea');
            else
                this.sortul.removeClass('keeparea');
        },
        addWithView: function (m) {
            var mod = new ItemModel(m);
            this.add(mod);
            var view = new ItemView({ model: mod, listid: this.id, index: this.sortul.children('li').length });
            this.sortul.append(view.render().el);
        },
        addWithViewByIndex: function (m, index) {
            var mod = new ItemModel(m);
            this.add(mod, { at: index });
            var view = new ItemView({ model: mod, listid: this.id, index: index });
            this.sortul.children('li').eq(index).replaceWith(view.render().el);
        }
    });

    var ItemView = Backbone.View.extend({
        tagName: "li",
        events: {
            "click span.oplink": "openlink",
            "click span.del": "remove",
            "click a": "openedit"
        },
        initialize: function (spec) {
            _.bindAll(this, 'html', 'render', 'change');
            this.listid = spec.listid;
            this.index = spec.index;

            var tempobj = itemtempget(this.model.get('tempid'));
            this.temp = tempobj.ToHtml;
            this.tempProps = sea.JSON.parse(tempobj.Props);
        },
        html: function () {
            var o = $(mc.to_html(this.temp, this.model.toJSON()));
            $(this.el).html(o)
            .append('<span class="del"></span>')
            .append('<span class="oplink"></span>');
            var bi_str = o.css("background-image");
            if ((bi_str == "none" || bi_str == "") && o.attr('class').indexOf("ico_") > 0) {
                o.addClass('ico_def');
                o.attr({ 'title': '图标的图片暂时缺失，请联系某某某（工号：1234）' })
                o.tooltip({ position: { my: "center bottom", at: "center top", offset: "0 -5"} });
            }
        },
        render: function () {
            this.html();
            return this;
        },
        change: function (define) {
            this.model.set(define);
            this.html();
            SeatApp.validate();
        },
        remove: function () {
            //if (confirm("确定要删除?")) return;
            $(this.el).remove();
            SeatApp.item_del(this.listid, this.index);
            return false;
        },
        openedit: function (e) {
            dialog.Prop(this, SeatApp.auths);
            return false;
        },
        openlink: function () {
            var href = this.model.get('href');
            window.open(href, '', 'height=500,width=611,scrollbars=yes,status=yes');
            return false;
        }
    });

    var ItemModel = Backbone.Model.extend({
        defaults: {
            tempid: 1,
            href: '#9'
        },
        validate: function (attrs) {
            var ok = true;
            if (attrs.tempid && _.isNaN(parseInt(attrs.tempid))) ok = false;
            if (ok) {
                sea.clearnotifi('useitem_error');
            } else {
                sea.shownotifi('字段验证错误！请联系管理员', 'error', 'useitem_error');
            }
        }
    });

    var itemtempget = function (id) {
        return _.find(glo_itemtemps, function (item) {
            return item.Id == id;
        });
    }

});