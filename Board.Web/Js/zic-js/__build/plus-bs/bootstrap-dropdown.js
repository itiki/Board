define(function(){return function(h){!function(b){function f(){b(g).parent().removeClass("open")}var g='[data-toggle="dropdown"]',d=function(c){var a=b(c).on("click.dropdown.data-api",this.toggle);b("html").on("click.dropdown.data-api",function(){a.parent().removeClass("open")})};d.prototype={constructor:d,toggle:function(){var c=b(this),a=c.attr("data-target");a||(a=(a=c.attr("href"))&&a.replace(/.*(?=#[^\s]*$)/,""));a=b(a);a.length||(a=c.parent());c=a.hasClass("open");f();!c&&a.toggleClass("open");
return!1}};b.fn.dropdown=function(c){return this.each(function(){var a=b(this),e=a.data("dropdown");e||a.data("dropdown",e=new d(this));"string"==typeof c&&e[c].call(a)})};b.fn.dropdown.Constructor=d;b(function(){b("html").on("click.dropdown.data-api",f);b("body").on("click.dropdown.data-api",g,d.prototype.toggle)})}(h)}});
