define(function(){return function(b){b.fn.holdinput=function(){this.bind("keypress",function(){var a=b(this);a.val().length>a.attr("maxlength")&&a.val(a.val().substr(0,a.attr("maxlength")))})}}});
