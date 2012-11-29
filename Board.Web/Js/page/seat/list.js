
  seajs.use(glo_path + 'init', function(init) {
    var $, fix;
    $ = init.jq;
    fix = function(box) {
      return init.fix_pager(box);
    };
    return $(function() {
      return fix($('body'));
    });
  });
