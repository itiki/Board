define(function(){return function(a,f){a.fn.switchTab=function(j){var h=a.extend({hov:!1,reflash:!1},j);this.each(function(){var c=a(this);if(c.data("init"))return!0;var d=c.attr("box");a("li",c).removeClass("act");a("[id*='"+d+"-']").hide();if(h.reflash){var b=f.rrequest("tb"+d);b||(b=0);var e=a("li",c).eq(b)}else{var i=f.url_segment(2)+"/"+f.url_segment(1)+"tb-"+d;(b=a.cookie(i))||(b=0);e=a("li",c).eq(b)}e.addClass("act");a("#"+d+"-"+b).show();a("li",c).each(function(b){var g=a(this),e=function(){a("li",
c).removeClass("act");a("[id*='"+d+"-']").hide();g.addClass("act");a("#"+d+"-"+b).show();a.cookie(i,b);a.fn.pngFix&&c.pngFix()};h.reflash?g.bind("click",function(){f.urlSetParmsValue("tb"+d,b);a.fn.pngFix&&c.pngFix()}):g.bind("click",e);h.hov&&g.bind("mouseover",e)});c.data("init",!0)})}}});
