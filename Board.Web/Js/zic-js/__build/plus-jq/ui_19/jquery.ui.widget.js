define(function(){return function(k){(function(b,j){var m=0,l=Array.prototype.slice,n=b.cleanData;b.cleanData=function(a){for(var c=0,f;null!=(f=a[c]);c++)try{b(f).triggerHandler("remove")}catch(d){}n(a)};b.widget=function(a,c,f){var d,e,g,h,i=a.split(".")[0],a=a.split(".")[1];d=i+"-"+a;f||(f=c,c=b.Widget);b.expr[":"][d]=function(a){return!!b.data(a,d)};b[i]=b[i]||{};e=b[i][a];g=b[i][a]=function(a,b){if(!this._createWidget)return new g(a,b);arguments.length&&this._createWidget(a,b)};b.extend(g,e,
{version:f.version,_proto:b.extend({},f),_childConstructors:[]});h=new c;h.options=b.widget.extend({},h.options);b.each(f,function(a,d){b.isFunction(d)&&(f[a]=function(){var b=function(){return c.prototype[a].apply(this,arguments)},f=function(b){return c.prototype[a].apply(this,b)};return function(){var a=this._super,c=this._superApply,e;this._super=b;this._superApply=f;e=d.apply(this,arguments);this._super=a;this._superApply=c;return e}}())});g.prototype=b.widget.extend(h,{widgetEventPrefix:a},f,
{constructor:g,namespace:i,widgetName:a,widgetBaseClass:d,widgetFullName:d});e?(b.each(e._childConstructors,function(a,c){var d=c.prototype;b.widget(d.namespace+"."+d.widgetName,g,c._proto)}),delete e._childConstructors):c._childConstructors.push(g);b.widget.bridge(a,g)};b.widget.extend=function(a){for(var c=l.call(arguments,1),f=0,d=c.length,e,g;f<d;f++)for(e in c[f])g=c[f][e],c[f].hasOwnProperty(e)&&g!==j&&(a[e]=b.isPlainObject(g)?b.widget.extend({},a[e],g):g);return a};b.widget.bridge=function(a,
c){var f=c.prototype.widgetFullName;b.fn[a]=function(d){var e="string"===typeof d,g=l.call(arguments,1),h=this,d=!e&&g.length?b.widget.extend.apply(null,[d].concat(g)):d;e?this.each(function(){var c,e=b.data(this,f);if(!e)return b.error("cannot call methods on "+a+" prior to initialization; attempted to call method '"+d+"'");if(!b.isFunction(e[d])||"_"===d.charAt(0))return b.error("no such method '"+d+"' for "+a+" widget instance");c=e[d].apply(e,g);if(c!==e&&c!==j)return h=c&&c.jquery?h.pushStack(c.get()):
c,!1}):this.each(function(){var a=b.data(this,f);a?a.option(d||{})._init():new c(d,this)});return h}};b.Widget=function(){};b.Widget._childConstructors=[];b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(a,c){c=b(c||this.defaultElement||this)[0];this.element=b(c);this.uuid=m++;this.eventNamespace="."+this.widgetName+this.uuid;this.options=b.widget.extend({},this.options,this._getCreateOptions(),a);this.bindings=
b();this.hoverable=b();this.focusable=b();c!==this&&(b.data(c,this.widgetName,this),b.data(c,this.widgetFullName,this),this._on({remove:"destroy"}),this.document=b(c.style?c.ownerDocument:c.document||c),this.window=b(this.document[0].defaultView||this.document[0].parentWindow));this._create();this._trigger("create",null,this._getCreateEventData());this._init()},_getCreateOptions:b.noop,_getCreateEventData:b.noop,_create:b.noop,_init:b.noop,destroy:function(){this._destroy();this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(b.camelCase(this.widgetFullName));
this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled");this.bindings.unbind(this.eventNamespace);this.hoverable.removeClass("ui-state-hover");this.focusable.removeClass("ui-state-focus")},_destroy:b.noop,widget:function(){return this.element},option:function(a,c){var f=a,d,e,g;if(0===arguments.length)return b.widget.extend({},this.options);if("string"===typeof a)if(f={},d=a.split("."),a=d.shift(),d.length){e=f[a]=b.widget.extend({},
this.options[a]);for(g=0;g<d.length-1;g++)e[d[g]]=e[d[g]]||{},e=e[d[g]];a=d.pop();if(c===j)return e[a]===j?null:e[a];e[a]=c}else{if(c===j)return this.options[a]===j?null:this.options[a];f[a]=c}this._setOptions(f);return this},_setOptions:function(a){for(var c in a)this._setOption(c,a[c]);return this},_setOption:function(a,c){this.options[a]=c;"disabled"===a&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!c).attr("aria-disabled",c),this.hoverable.removeClass("ui-state-hover"),
this.focusable.removeClass("ui-state-focus"));return this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(a,c){c?(a=b(a),this.bindings=this.bindings.add(a)):(c=a,a=this.element);var f=this;b.each(c,function(c,e){function g(){return!0===f.options.disabled||b(this).hasClass("ui-state-disabled")?void 0:("string"===typeof e?f[e]:e).apply(f,arguments)}"string"!==typeof e&&(g.guid=e.guid=e.guid||g.guid||k.guid++);var h=c.match(/^(\w+)\s*(.*)$/),
i=h[1]+f.eventNamespace;(h=h[2])?f.widget().delegate(h,i,g):a.bind(i,g)})},_off:function(a,c){c=(c||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace;a.unbind(c).undelegate(c)},_delay:function(a,c){var b=this;return setTimeout(function(){return("string"===typeof a?b[a]:a).apply(b,arguments)},c||0)},_hoverable:function(a){this.hoverable=this.hoverable.add(a);this._on(a,{mouseenter:function(a){b(a.currentTarget).addClass("ui-state-hover")},mouseleave:function(a){b(a.currentTarget).removeClass("ui-state-hover")}})},
_focusable:function(a){this.focusable=this.focusable.add(a);this._on(a,{focusin:function(a){b(a.currentTarget).addClass("ui-state-focus")},focusout:function(a){b(a.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(a,c,f){var d,e=this.options[a],f=f||{},c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();c.target=this.element[0];if(a=c.originalEvent)for(d in a)d in c||(c[d]=a[d]);this.element.trigger(c,f);return!(b.isFunction(e)&&!1===e.apply(this.element[0],
[c].concat(f))||c.isDefaultPrevented())}};b.each({show:"fadeIn",hide:"fadeOut"},function(a,c){b.Widget.prototype["_"+a]=function(f,d,e){"string"===typeof d&&(d={effect:d});var g,h=!d?a:!0===d||"number"===typeof d?c:d.effect||c,d=d||{};"number"===typeof d&&(d={duration:d});g=!b.isEmptyObject(d);d.complete=e;d.delay&&f.delay(d.delay);if(g&&b.effects&&(b.effects.effect[h]||!1!==b.uiBackCompat&&b.effects[h]))f[a](d);else if(h!==a&&f[h])f[h](d.duration,d.easing,e);else f.queue(function(c){b(this)[a]();
e&&e.call(f[0]);c()})}});!1!==b.uiBackCompat&&(b.Widget.prototype._getCreateOptions=function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]})})(k)}});
