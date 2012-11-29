
  seajs.use([glo_path + "init", "plus-jq/jq_ztree", glo_path + "app/seat"], function(init, ztree, seat) {
    var $, fix;
    $ = init.jq;
    fix = function(box) {
      return init.fix_submit(box);
    };
    seat.Init(init);
    ztree($);
    return $(function() {
      var cusfolder, item, treeindex, znodes, _i, _len;
      fix($('body'));
      seat.Loader({
        el: $("#seatbox"),
        sub: $("#submit"),
        el_classic: $("#seatbox_c"),
        sub_classic: $("#submit_c"),
        fluent: $("#fluent"),
        classic: $("#classic"),
        turnbtn: $("#turnbtn"),
        exchange: $("#exchange"),
        userst_json: glo_userstore,
        userst_dom: $("#userprivbox")
      });
      treeindex = $('#treeindex');
      znodes = glo_nodes === "" ? [] : init.JSON.parse(glo_nodes);
      cusfolder = glo_cusfolder === "" ? [] : init.JSON.parse(glo_cusfolder);
      for (_i = 0, _len = cusfolder.length; _i < _len; _i++) {
        item = cusfolder[_i];
        znodes.push(item);
      }
      $.fn.zTree.init(treeindex, {
        data: {
          key: {
            title: "Description",
            name: 'Name'
          },
          simpleData: {
            enable: true,
            idKey: 'Id',
            pIdKey: 'ParentFolderId'
          }
        },
        edit: {
          enable: true,
          showRenameBtn: false,
          showRemoveBtn: false,
          drag: {
            isCopy: false,
            isMove: true,
            prev: true,
            next: true,
            inner: true
          }
        },
        view: {
          dblClickExpand: false
        },
        callback: {
          onClick: function(e, treeId, treeNode, clickFlag) {
            return $.ajax({
              url: "/Seat/UseInject",
              data: {
                seatid: treeNode.Id
              },
              success: function(m) {
                if (!init.checkreturn(m)) return;
                return seat.InitApp({
                  mod: m.seat,
                  propauth: m.propauth
                });
              }
            });
          },
          onDrop: function(e, treeId, treeNodes) {
            var cusnodes, treeObj;
            treeObj = $.fn.zTree.getZTreeObj(treeId);
            cusnodes = treeObj.getNodesByParam('ParentFolderId', 1000);
            return $.ajax({
              url: "/Seat/UseUpdateCusNodes",
              data: {
                cus_nodes: init.JSON.stringify(cusnodes)
              },
              success: function(m) {
                if (!init.checkreturn(m)) {
                  return init.shownotifi('更新自定义文件夹出错，请联系管理员。');
                }
              }
            });
          }
        }
      }, znodes);
      $('[treenode_a]', treeindex).click(function() {
        var button;
        button = $(this).prev('button.center_close, button.center_open, button.roots_open, button.roots_close');
        if (!button.length) return;
        $('button.center_open, button.roots_open', treeindex).not(button).click();
        return button.click();
      });
      return $('button.ico_docu', treeindex).first().click();
    });
  });
