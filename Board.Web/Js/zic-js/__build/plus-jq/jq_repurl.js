define(function(){return function(a){a.fn.repurl=function(c){var d=a.extend({reg:/^http:\/\/qshort\.net\/.{6}$/ig},c);this.each(function(){var b=a(this);b.text(b.text().replace(d.reg,function(a){return'<a href="'+a+'">'+a+"</a>"}))})}}});
