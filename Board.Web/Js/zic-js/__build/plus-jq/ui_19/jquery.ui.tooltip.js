define(function(){return function(g){(function(d){function g(a,b){var e=(a.attr("aria-describedby")||"").split(/\s+/);e.push(b);a.data("ui-tooltip-id",b).attr("aria-describedby",d.trim(e.join(" ")))}function i(a){var b=a.data("ui-tooltip-id"),e=(a.attr("aria-describedby")||"").split(/\s+/),b=d.inArray(b,e);-1!==b&&e.splice(b,1);a.removeData("ui-tooltip-id");(e=d.trim(e.join(" ")))?a.attr("aria-describedby",e):a.removeAttr("aria-describedby")}var j=0;d.widget("ui.tooltip",{version:"@VERSION",options:{content:function(){return d(this).attr("title")},
hide:!0,items:"[title]",position:{my:"left+15 center",at:"right center",collision:"flipfit flipfit"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"});this.tooltips={}},_setOption:function(a,b){"disabled"===a?(this[b?"_disable":"_enable"](),this.options[a]=b):this._super(a,b)},_disable:function(){var a=this;d.each(this.tooltips,function(b,e){var c=d.Event("blur");c.target=c.currentTarget=e[0];a.close(c,!0)});this.element.find(this.options.items).andSelf().each(function(){var a=
d(this);a.is("[title]")&&a.data("ui-tooltip-title",a.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).andSelf().each(function(){var a=d(this);a.data("ui-tooltip-title")&&a.attr("title",a.data("ui-tooltip-title"))})},open:function(a){var b,e=this,c=d(a?a.target:this.element).closest(this.options.items);c.length&&(this.options.track&&c.data("ui-tooltip-id")?this._find(c).position(d.extend({of:c},this.options.position)):(c.attr("title")&&c.data("ui-tooltip-title",
c.attr("title")),c.data("tooltip-open",!0),(b=this.options.content.call(c[0],function(b){c.data("tooltip-open")&&setTimeout(function(){e._open(a,c,b)},1)}))&&e._open(a,c,b)))},_open:function(a,b,e){function c(a){h.of=a;f.position(h)}var f,h;e&&(f=this._find(b),f.length?f.find(".ui-tooltip-content").html(e):(b.is("[title]")&&(a&&"mouseover"===a.type?b.attr("title",""):b.removeAttr("title")),f=this._tooltip(b),g(b,f.attr("id")),f.find(".ui-tooltip-content").html(e),this.options.track&&/^mouse/.test(a.originalEvent.type)?
(h=d.extend({},this.options.position),this._on(this.document,{mousemove:c}),c(a)):f.position(d.extend({of:b},this.options.position)),f.hide(),this._show(f,this.options.show),this._trigger("open",a,{tooltip:f}),this._on(b,{mouseleave:"close",focusout:"close",keyup:function(a){a.keyCode===d.ui.keyCode.ESCAPE&&(a=d.Event(a),a.currentTarget=b[0],this.close(a,!0))}})))},close:function(a,b){var e=this,c=d(a?a.currentTarget:this.element),f=this._find(c);this.closing||!b&&a&&"focusout"!==a.type&&this.document[0].activeElement===
c[0]||(c.data("ui-tooltip-title")&&c.attr("title",c.data("ui-tooltip-title")),i(c),f.stop(!0),this._hide(f,this.options.hide,function(){d(this).remove();delete e.tooltips[this.id]}),c.removeData("tooltip-open"),this._off(c,"mouseleave focusout keyup"),this._off(this.document,"mousemove"),this.closing=!0,this._trigger("close",a,{tooltip:f}),this.closing=!1)},_tooltip:function(a){var b="ui-tooltip-"+j++,e=d("<div>").attr({id:b,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+
(this.options.tooltipClass||""));d("<div>").addClass("ui-tooltip-content").appendTo(e);e.appendTo(this.document[0].body);d.fn.bgiframe&&e.bgiframe();this.tooltips[b]=a;return e},_find:function(a){return(a=a.data("ui-tooltip-id"))?d("#"+a):d()},_destroy:function(){d.each(this.tooltips,function(a){d("#"+a).remove()})}})})(g)}});