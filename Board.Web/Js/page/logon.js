(function() {

  seajs.use(glo_path + 'init', function(init) {
    var $, fix;
    $ = init.jq;
    fix = function(box) {
      return init.fix_submit(box);
    };
    return $(function() {
      return fix($('body'));
    });
  });

}).call(this);
