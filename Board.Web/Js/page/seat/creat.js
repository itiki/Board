
  seajs.use([glo_path + 'init', glo_path + "app/temp"], function(init, temp) {
    var $, fix;
    $ = init.jq;
    fix = function(box) {};
    temp.Init(init);
    return $(function() {
      fix($('body'));
      return window.App = new temp.TempAppView({
        el: $("#tempbox"),
        defline: 3,
        btnAddT: $('#btnAddT'),
        btnAddH: $('#btnAddH'),
        formSubmit: $("#vali_form"),
        txtName: $("#seatName"),
        folderSel: $("#Folders")
      });
    });
  });
